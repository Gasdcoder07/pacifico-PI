import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/products/{input}:
 *   get:
 *     summary: Buscar productos por nombre
 *     description: Retorna la lista de productos filtrados por el término de búsqueda, compañía y sucursal del usuario.
 *     tags:
 *       - Productos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: input
 *         required: true
 *         schema:
 *           type: string
 *         description: Término a buscar en el nombre del producto
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: No autorizado (token ausente o inválido)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(
    request: Request, 
    { params } : {params: Promise<{input: string}>}
) {
    try {
        const authHeader = request.headers.get("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No se pudo obtener el token de sesión" },
                { status: 401 }
            )
        }

        const token = authHeader.split(" ")[1]

        if (!token) return NextResponse.json(
            { error: "No enviaste token en la petición" },
            { status: 401 }
        )

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "No se pudo obtener el usuario correspondiente a esta sesión" },
                { status: 404 }
            )
        }

        const currentUserQuery = await pool.query(`SELECT rol_id, company_id, branch_id FROM usuarios WHERE auth_user_id = $1`, [authUser.id])

        const currentUser = currentUserQuery.rows[0]

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            )
        }

        const { input } = await params;
        const search = input.trim();

        const productsQuery = await pool.query(
        `
            SELECT
                p.id AS product_id,
                i.id AS inventario_id,

                p.name,
                p.description,
                p.price::DOUBLE PRECISION AS price,
                p.foto_url,

                p.category_id,
                c.name AS category_name,

                i.branch_id,
                s.name AS branch_name,

                i.quantity,
                i.min_stock,

                i.updated_at

            FROM public.productos p

            INNER JOIN public.inventario i
                ON i.product_id = p.id

            INNER JOIN public.sucursales s
                ON s.id = i.branch_id

            LEFT JOIN public.categorias c
                ON c.id = p.category_id

            WHERE p.company_id = $1
            AND i.branch_id = $2
            AND p.name ILIKE $3

            ORDER BY p.name ASC, p.id ASC
        `,
        [
            currentUser.company_id,
            currentUser.branch_id,
            `%${search}%`,
        ]
    );

        return NextResponse.json(
            { data: productsQuery.rows },
            { status: 200 }
        )

    }catch(err) {
        return NextResponse.json(
            { error: `Error interno de la base de datos ${err}`  },
            { status: 500 }
        )
    }
}