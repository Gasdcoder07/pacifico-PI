import pool from "@/shared/lib/db";
import { NextResponse } from "next/server";
import {
    apiError,
    getActor,
    HttpError,
    validId,
} from "@/shared/utils/inventory-access";
import { supabase } from "@/shared/lib/supabase";

export async function GET(request: Request) {
    try {
        const actor = await getActor(request, [1, 2, 3]);

        const { rows } = await pool.query(
            `SELECT
                i.branch_id::text AS branch_id,
                s.name AS branch_name,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'inventario_id', i.id::text,
                            'product_id', p.id::text,
                            'name', p.name,
                            'foto_url', p.foto_url,
                            'description', p.description,
                            'price', p.price,
                            'category_id', c.id::text,
                            'category_name', c.name,
                            'branch_id', i.branch_id::text,
                            'branch_name', s.name,
                            'quantity', i.quantity,
                            'min_stock', i.min_stock,
                            'updated_at', i.updated_at,
                            'sucursales', (
                                SELECT COALESCE(
                                    jsonb_agg(
                                        jsonb_build_object(
                                            'inventario_id', inv2.id::text,
                                            'branch_id', inv2.branch_id::text,
                                            'branch_name', suc2.name,
                                            'quantity', inv2.quantity,
                                            'min_stock', inv2.min_stock
                                        )
                                    ), 
                                    '[]'::jsonb
                                )
                                FROM public.inventario inv2
                                JOIN public.sucursales suc2
                                    ON suc2.id = inv2.branch_id
                                    AND suc2.company_id = inv2.company_id
                                WHERE inv2.product_id = p.id 
                                  AND inv2.company_id = p.company_id
                                  AND suc2.status = true
                                  AND ($2::bigint is NULL OR inv2.branch_id = $2)
                            )
                        )
                        ORDER BY p.name, p.id
                    ),
                    '[]'::jsonb
                ) AS productos
            FROM public.inventario i
            JOIN public.productos p
                ON p.id = i.product_id
                AND p.company_id = i.company_id
            JOIN public.categorias c
                ON c.id = p.category_id
                AND c.company_id = p.company_id
            JOIN public.sucursales s
                ON s.id = i.branch_id
                AND s.company_id = i.company_id
            WHERE i.company_id = $1
                AND p.status = true
                AND s.status = true
                AND ($2::bigint IS NULL OR i.branch_id = $2)
            GROUP BY i.branch_id, s.name
            ORDER BY i.branch_id`,
            [actor.company_id, actor.rol_id === 1 ? null : actor.branch_id]
        );

        return NextResponse.json(rows, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        return apiError(error);
    }
}

export async function POST(request: Request) {
    try {
        const actor = await getActor(request, [1, 2]);

        const body = await request.json();
        const productId = validId(String(body.category_id ?? ""));
        const branches = body.branches;

        if (!Array.isArray(branches) || branches.length === 0) {
            throw new HttpError(400, "Se requiere un arreglo de sucursales válido");
        }

        type Allocation = {
            branch_id: string;
            quantity: number;
            min_stock: number | null;
        };

        const allocations: Allocation[] = branches.map((value: unknown) => {
            if (
                typeof value !== "object" ||
                value === null ||
                Array.isArray(value)
            ) {
                throw new HttpError(400, "Asignación de sucursal inválida");
            }

            const item = value as Record<string, unknown>;
            const branchId = validId(String(item.branch_id ?? ""));

            if (
                typeof item.quantity !== "number" ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 0 ||
                item.quantity > 2147483647
            ) {
                throw new HttpError(400, "La cantidad debe ser un entero válido");
            }

            let minStock: number | null = null;

            if (item.min_stock !== undefined && item.min_stock !== null) {
                if (
                    typeof item.min_stock !== "number" ||
                    !Number.isSafeInteger(item.min_stock) ||
                    item.min_stock < 0 ||
                    item.min_stock > 2147483647
                ) {
                    throw new HttpError(400, "El stock mínimo no es válido");
                }

                minStock = item.min_stock;
            }

            return {
                branch_id: branchId,
                quantity: item.quantity,
                min_stock: minStock,
            };
        });

        const branchIds = allocations.map(item => item.branch_id);

        if (new Set(branchIds).size !== branchIds.length) {
            throw new HttpError(400, "No puedes enviar sucursales duplicadas");
        }

        if (
            actor.rol_id === 2 &&
            allocations.some(item => item.branch_id !== String(actor.branch_id))
        ) {
            throw new HttpError(403, "Solo puedes actualizar el inventario de tu sucursal");
        }

        const client = await pool.connect();

        const updatedInventory: Record<string, unknown>[] = [];

        try {
            await client.query("BEGIN");

            const productQuery = await client.query(
                `
                SELECT id
                FROM public.productos
                WHERE id = $1
                    AND company_id = $2
                    AND status = true
                FOR UPDATE
                `,
                [productId, actor.company_id]
            );

            if (!productQuery.rows[0]) {
                throw new HttpError(404, "Producto activo no encontrado en tu empresa");
            }

            const checkBranchesQuery = await client.query(
                `
                SELECT id
                FROM public.sucursales
                WHERE id = ANY($1::bigint[])
                    AND company_id = $2
                    AND status = true
                `,
                [branchIds, actor.company_id]
            );

            if (checkBranchesQuery.rowCount !== branchIds.length) {
                throw new HttpError(
                    403,
                    "Una o más sucursales no pertenecen a tu empresa o están inactivas"
                );
            }

            // Sucursales con stock mínimo especificado
            const withMinStock = allocations.filter(
                item => item.min_stock !== null
            );

            if (withMinStock.length > 0) {
                const result = await client.query(
                    `
                    INSERT INTO public.inventario AS stock (
                        company_id,
                        branch_id,
                        product_id,
                        quantity,
                        min_stock
                    )
                    SELECT
                        $1,
                        x.branch_id,
                        $2,
                        x.quantity,
                        x.min_stock
                    FROM UNNEST(
                        $3::bigint[],
                        $4::integer[],
                        $5::integer[]
                    ) AS x(branch_id, quantity, min_stock)
                    ON CONFLICT (branch_id, product_id)
                    DO UPDATE SET
                        quantity = stock.quantity + EXCLUDED.quantity,
                        min_stock = EXCLUDED.min_stock,
                        updated_at = NOW()
                    WHERE stock.company_id = EXCLUDED.company_id
                    RETURNING
                        id::text AS id,
                        company_id::text AS company_id,
                        branch_id::text AS branch_id,
                        product_id::text AS product_id,
                        quantity,
                        min_stock,
                        updated_at
                    `,
                    [
                        actor.company_id,
                        productId,
                        withMinStock.map(item => item.branch_id),
                        withMinStock.map(item => item.quantity),
                        withMinStock.map(item => item.min_stock),
                    ]
                );

                updatedInventory.push(...result.rows);
            }

            // Sucursales sin stock mínimo: conserva el existente al actualizar
            const withoutMinStock = allocations.filter(
                item => item.min_stock === null
            );

            if (withoutMinStock.length > 0) {
                const result = await client.query(
                    `
                    INSERT INTO public.inventario AS stock (
                        company_id,
                        branch_id,
                        product_id,
                        quantity,
                        min_stock
                    )
                    SELECT
                        $1,
                        x.branch_id,
                        $2,
                        x.quantity,
                        5
                    FROM UNNEST(
                        $3::bigint[],
                        $4::integer[]
                    ) AS x(branch_id, quantity)
                    ON CONFLICT (branch_id, product_id)
                    DO UPDATE SET
                        quantity = stock.quantity + EXCLUDED.quantity,
                        updated_at = NOW()
                    WHERE stock.company_id = EXCLUDED.company_id
                    RETURNING
                        id::text AS id,
                        company_id::text AS company_id,
                        branch_id::text AS branch_id,
                        product_id::text AS product_id,
                        quantity,
                        min_stock,
                        updated_at
                    `,
                    [
                        actor.company_id,
                        productId,
                        withoutMinStock.map(item => item.branch_id),
                        withoutMinStock.map(item => item.quantity),
                    ]
                );

                updatedInventory.push(...result.rows);
            }

            if (updatedInventory.length !== allocations.length) {
                throw new HttpError(
                    409,
                    "Una o más asignaciones de inventario no pudieron actualizarse"
                );
            }

            await client.query("COMMIT");

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

        return NextResponse.json(
            {
                message: "Existencias agregadas con éxito",
                data: updatedInventory,
            },
            { status: 200 }
        );

    } catch (error) {
        return apiError(error);
    }
}