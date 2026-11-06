import pool from "@/shared/lib/db";
import { NextResponse } from "next/server";
import {
    apiError,
    checkBranches,
    getActor,
    HttpError,
    readAllocations,
    readBody,
    transaction,
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
                                            'quantity', inv2.quantity
                                        )
                                    ), 
                                    '[]'::jsonb
                                )
                                FROM public.inventario inv2
                                JOIN public.sucursales suc2 ON suc2.id = inv2.branch_id
                                WHERE inv2.product_id = p.id 
                                  AND inv2.company_id = p.company_id
                                  AND suc2.status = true
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
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Sesión vencida o token inválido" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: `Ocurrió un error al obtener la información del usuario ${authError?.message || authError}` },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT rol_id, branch_id, company_id FROM usuarios WHERE auth_user_id = $1`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se encontró un perfil de usuario asociado a esta sesión" },
                { status: 404 }
            );
        }

        if (Number(currentUser.rol_id) !== 1 && Number(currentUser.rol_id) !== 2) {
            return NextResponse.json(
                { error: "No tienes permiso para actualizar el inventario" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const category_id = Number(body.category_id);
        const branches = body.branches;

        if (!category_id || isNaN(category_id)) {
            return NextResponse.json(
                { error: "El ID del producto es inválido o no fue enviado" },
                { status: 400 }
            );
        }

        if (!Array.isArray(branches) || branches.length === 0) {
            return NextResponse.json(
                { error: "Se requiere un arreglo de sucursales válido" },
                { status: 400 }
            );
        }

        for (const item of branches) {
            if (!item.branch_id || typeof item.quantity !== 'number') {
                return NextResponse.json(
                    { error: "Los datos de asignación de sucursales están incompletos (requiere branch_id y quantity)" },
                    { status: 400 }
                );
            }
        }

        const client = await pool.connect();
        const updatedInventory = [];

        try {
            await client.query('BEGIN');

            const productQuery = await client.query(
                `SELECT id
                FROM public.productos
                WHERE id = $1
                    AND company_id = $2
                    AND status = true
                FOR UPDATE`,
                [category_id, currentUser.company_id]
            );

            if (!productQuery.rows[0]) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                    { error: "Producto activo no encontrado en tu empresa" },
                    { status: 404 }
                );
            }

            const branchIds = branches.map(item => item.branch_id);
            const checkBranchesQuery = await client.query(
                `SELECT id FROM public.sucursales WHERE id = ANY($1) AND company_id = $2`,
                [branchIds, currentUser.company_id]
            );

            if (checkBranchesQuery.rowCount !== branchIds.length) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                    { error: "Una o más sucursales asignadas no pertenecen a tu empresa" },
                    { status: 403 }
                );
            }

            for (const branch of branches) {
                const result = await client.query(
                    `INSERT INTO public.inventario AS stock (
                        company_id, branch_id, product_id,
                        quantity, min_stock
                    )
                    VALUES ($1, $2, $3, $4, COALESCE($5::integer, 5))
                    ON CONFLICT (branch_id, product_id)
                    DO UPDATE SET
                        quantity = stock.quantity + EXCLUDED.quantity,
                        min_stock = COALESCE($5::integer, stock.min_stock),
                        updated_at = now()
                    WHERE stock.company_id = EXCLUDED.company_id
                    RETURNING *`,
                    [
                        currentUser.company_id,
                        branch.branch_id,
                        category_id,
                        branch.quantity,
                        branch.min_stock ?? null,
                    ]
                );

                if (!result.rows[0]) {
                    await client.query('ROLLBACK');
                    return NextResponse.json(
                        { error: "La asignación de inventario no corresponde a la empresa" },
                        { status: 409 }
                    );
                }

                updatedInventory.push(result.rows[0]);
            }

            await client.query('COMMIT');

        } catch (dbError) {
            await client.query('ROLLBACK');
            throw dbError;
        } finally {
            client.release();
        }

        return NextResponse.json(
            { message: "Existencias agregadas con éxito", data: updatedInventory },
            { status: 200 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: `Error interno en el backend: ${err instanceof Error ? err.message : String(err)}` },
            { status: 500 }
        );
    }
}