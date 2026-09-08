import { NextResponse } from "next/server";
import { pool } from "@/lib/db"
import { supabase } from "@/lib/supabase";

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Consulta la base de datos y devuelve una lista con todos los registros de la tabla categorías.
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías recuperada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 2
 *                   nombre:
 *                     type: string
 *                     example: "Tecnología"
 *                   description:
 *                     type: string
 *                     example: "Artículos relacionados a tecnología"
 *                   
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-09-04T17:24:00Z"
 *       500:
 *         description: Internal Server Error. Fallo al consultar la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener las categorías"
 */

export async function GET( request: Request ) {
    try {

        const authHeader =  request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            )
        }

        const token = authHeader.split(" ")[1]

        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            )
        }

        const response = await pool.query(
            `SELECT * FROM categorias`
        )

        return NextResponse.json(
            { message: "Categorías extraídas con éxito", data: response.rows },
            { status: 200 }
        )

    } catch ( err ) {
        console.error(err)
        return NextResponse.json(
            { error: "Error al recibir las categorías" },
            { status: 500 }
        )
    }
}