import pool from "@/shared/lib/db";
import { NextResponse } from "next/server";
import {
    apiError,
    getActor,
    HttpError,
    validId,
} from "@/shared/utils/inventory-access";

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obtener el inventario agrupado por sucursal
 *     description: >
 *       Retorna el listado de inventario agrupado por sucursal.
 *       Los usuarios con rol 1 (Admin) pueden consultar todas las sucursales o filtrar por una específica mediante el parámetro `branch`.
 *       Los usuarios con roles 2 y 3 quedan restringidos automáticamente a su propia sucursal asignada.
 *     tags:
 *       - Inventario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branch
 *         required: false
 *         schema:
 *           type: string
 *           example: "1"
 *         description: ID de la sucursal para filtrar resultados (solo tiene efecto para rol 1; roles 2 y 3 usan su propia sucursal).
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           example: "4"
 *         description: ID de la categoría para filtrar los productos del inventario.
 *     responses:
 *       200:
 *         description: Inventario agrupado por sucursal obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branch_id:
 *                     type: string
 *                     example: "1"
 *                   branch_name:
 *                     type: string
 *                     example: "Sucursal Centro"
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         inventario_id:
 *                           type: string
 *                           example: "10"
 *                         product_id:
 *                           type: string
 *                           example: "25"
 *                         name:
 *                           type: string
 *                           example: "Laptop Dell Inspiron 15"
 *                         foto_url:
 *                           type: string
 *                           nullable: true
 *                           example: "https://ejemplo.com/foto.jpg"
 *                         description:
 *                           type: string
 *                           nullable: true
 *                           example: "Laptop 16GB RAM, 512GB SSD"
 *                         price:
 *                           type: number
 *                           example: 14500.00
 *                         category_id:
 *                           type: string
 *                           example: "4"
 *                         category_name:
 *                           type: string
 *                           example: "Cómputo"
 *                         branch_id:
 *                           type: string
 *                           example: "1"
 *                         branch_name:
 *                           type: string
 *                           example: "Sucursal Centro"
 *                         quantity:
 *                           type: integer
 *                           example: 12
 *                         min_stock:
 *                           type: integer
 *                           example: 5
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-11-18T10:00:00.000Z"
 *                         sucursales:
 *                           type: array
 *                           description: Disponibilidad del producto en las sucursales visibles para el usuario.
 *                           items:
 *                             type: object
 *                             properties:
 *                               inventario_id:
 *                                 type: string
 *                                 example: "10"
 *                               branch_id:
 *                                 type: string
 *                                 example: "1"
 *                               branch_name:
 *                                 type: string
 *                                 example: "Sucursal Centro"
 *                               quantity:
 *                                 type: integer
 *                                 example: 12
 *                               min_stock:
 *                                 type: integer
 *                                 example: 5
 *       400:
 *         description: Parámetro `branch` o `category` con formato de ID inválido.
 *       401:
 *         description: No autorizado (token faltante o inválido).
 *       403:
 *         description: Rol sin permisos para consultar este recurso.
 *       500:
 *         description: Error interno del servidor.
 */
export async function GET(request: Request) {
    try {
        const actor = await getActor(request, [1, 2, 3]);

        const { searchParams } = new URL(request.url);
        const branchParam = searchParams.get("branch");
        const categoryParam = searchParams.get("category");
        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");
        const search = searchParams.get("search")?.trim() ?? "";

        const requestedBranchId =
            branchParam !== null && branchParam !== ""
                ? validId(branchParam)
                : null;

        const categoryId =
            categoryParam !== null && categoryParam !== ""
                ? validId(categoryParam)
                : null;

        const effectiveBranchId =
            actor.rol_id === 1 ? requestedBranchId : actor.branch_id;

        const rawPage = pageParam ?? "1";
        const rawLimit = limitParam ?? "10";

        if (
            !/^[1-9]\d*$/.test(rawPage) ||
            !/^[1-9]\d*$/.test(rawLimit)
        ) {
            return NextResponse.json(
                { error: "Parámetros de paginación inválidos" },
                { status: 400 }
            );
        }

        const page = Number(rawPage);
        const limit = Number(rawLimit);
        const offset = (page - 1) * limit;

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            limit > 100 ||
            !Number.isSafeInteger(offset)
        ) {
            return NextResponse.json(
                { error: "Parámetros de paginación inválidos" },
                { status: 400 }
            );
        }
        
        const { rows: paginatedRows } = await pool.query(
            `
            WITH filtered AS (
                SELECT
                    i.id AS inventory_id,
                    i.company_id,
                    i.branch_id,
                    s.name AS branch_name,
                    p.id AS product_id,
                    p.name AS product_name,
                    p.foto_url,
                    p.description,
                    p.price,
                    c.id AS category_id,
                    c.name AS category_name,
                    i.quantity,
                    i.min_stock,
                    i.updated_at
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
                    AND ($3::bigint IS NULL OR p.category_id = $3)
                    AND (
                        $6::text = ''
                        OR p.name ILIKE '%' || $6::text || '%'
                    )
            ),

            total_count AS (
                SELECT COUNT(*)::int AS total
                FROM filtered
            ),

            paged AS (
                SELECT *
                FROM filtered
                ORDER BY product_name, product_id, inventory_id
                LIMIT $4::int
                OFFSET $5::bigint
            ),

            grouped AS (
                SELECT
                    f.branch_id::text AS branch_id,
                    f.branch_name,
                    jsonb_agg(
                        jsonb_build_object(
                            'inventario_id', f.inventory_id::text,
                            'product_id', f.product_id::text,
                            'name', f.product_name,
                            'foto_url', f.foto_url,
                            'description', f.description,
                            'price', f.price,
                            'category_id', f.category_id::text,
                            'category_name', f.category_name,
                            'branch_id', f.branch_id::text,
                            'branch_name', f.branch_name,
                            'quantity', f.quantity,
                            'min_stock', f.min_stock,
                            'updated_at', f.updated_at,
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
                                WHERE inv2.product_id = f.product_id
                                    AND inv2.company_id = f.company_id
                                    AND suc2.status = true
                                    AND (
                                        $2::bigint IS NULL
                                        OR inv2.branch_id = $2
                                    )
                            )
                        )
                        ORDER BY f.product_name, f.product_id
                    ) AS productos
                FROM paged f
                GROUP BY f.branch_id, f.branch_name
            )

            SELECT
                t.total,
                COALESCE(
                    (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'branch_id', g.branch_id,
                                'branch_name', g.branch_name,
                                'productos', g.productos
                            )
                            ORDER BY g.branch_id
                        )
                        FROM grouped g
                    ),
                    '[]'::jsonb
                ) AS data
            FROM total_count t
            `,
            [
                actor.company_id,
                effectiveBranchId,
                categoryId,
                limit,
                offset,
                search
            ]
        );

        const result = paginatedRows[0];
        const total = Number(result.total);

        return NextResponse.json(
            {
                data: result.data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            {
                headers: { "Cache-Control": "no-store" },
            }
        );
    } catch (error) {
        return apiError(error);
    }
}

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Agregar o incrementar existencias de un producto por sucursal
 *     description: >
 *       Asigna o suma existencias de un producto activo en una o varias sucursales activas de la empresa.
 *       Si el registro ya existe para la combinación `(branch_id, product_id)`, suma `quantity` al stock actual.
 *       Si se envía `min_stock`, actualiza el stock mínimo; si se omite o es `null`, conserva el existente (o asigna `5` si es un registro nuevo).
 *       Permitido para rol 1 (cualquier sucursal de la empresa) y rol 2 (únicamente su propia sucursal).
 *     tags:
 *       - Inventario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - branches
 *             properties:
 *               category_id:
 *                 type: string
 *                 description: ID del producto al que se le asignarán existencias.
 *                 example: "25"
 *               branches:
 *                 type: array
 *                 minItems: 1
 *                 description: Lista de sucursales con las cantidades a agregar. No permite `branch_id` duplicados.
 *                 items:
 *                   type: object
 *                   required:
 *                     - branch_id
 *                     - quantity
 *                   properties:
 *                     branch_id:
 *                       type: string
 *                       example: "1"
 *                     quantity:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 2147483647
 *                       description: Cantidad de unidades a sumar al inventario.
 *                       example: 15
 *                     min_stock:
 *                       type: integer
 *                       nullable: true
 *                       minimum: 0
 *                       maximum: 2147483647
 *                       description: Stock mínimo opcional para alertas.
 *                       example: 5
 *     responses:
 *       200:
 *         description: Existencias agregadas o actualizadas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Existencias agregadas con éxito"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "10"
 *                       company_id:
 *                         type: string
 *                         example: "1"
 *                       branch_id:
 *                         type: string
 *                         example: "1"
 *                       product_id:
 *                         type: string
 *                         example: "25"
 *                       quantity:
 *                         type: integer
 *                         example: 27
 *                       min_stock:
 *                         type: integer
 *                         example: 5
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-11-18T10:15:00.000Z"
 *       400:
 *         description: Datos inválidos (arreglo vacío, sucursales duplicadas, cantidad o stock mínimo fuera de rango).
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Sin permisos para actualizar una o más sucursales enviadas.
 *       404:
 *         description: Producto activo no encontrado en la empresa.
 *       409:
 *         description: Conflicto al actualizar una o más asignaciones de inventario.
 *       500:
 *         description: Error interno del servidor.
 */
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