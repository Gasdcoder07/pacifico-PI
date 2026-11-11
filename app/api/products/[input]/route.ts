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

        const { input } = await params
        const decodedInput = decodeURIComponent(input || "")

        const productsQuery = await pool.query(
            `SELECT * FROM productos 
             WHERE company_id = $1 
               AND branch_id = $2 
               AND name ILIKE $3`, 
            [currentUser.company_id, currentUser.branch_id, `%${decodedInput}%`]
        );

        return NextResponse.json(
            { data: productsQuery.rows },
            { status: 2022 }
        )

    }catch(err) {
        return NextResponse.json(
            { error: `Error interno de la base de datos ${err}`  },
            { status: 500 }
        )
    }
}