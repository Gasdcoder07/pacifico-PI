import { NextResponse } from "next/server";
import { pool } from "@/shared/lib/db"
import { supabase } from "@/shared/lib/supabase";

/**
 * @swagger
 * /api/sucursales/{id}:
 *   get:
 *     summary: Obtener una sucursal
 *     description: Consulta la base de datos y devuelve una lista con todos los registros de la sucursal seleccionada.
 *     tags:
 *       - Sucursales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de la sucursal recuperada exitosamente.
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
 *                     example: "Sucursal Centro"
 *                   direccion:
 *                     type: string
 *                     example: "Av. Principal 123"
 *                   telefono:
 *                     type: string
 *                     example: "314 125 7959"
 *                   info_contacto:
 *                     type: string
 *                     example: "Esta es la información de contacto"
 *                   estado:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-09-04T17:24:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-09-04T17:25:00Z"
 *       404:
 *         description: Sucursal inexistente o fuera del acceso del usuario
 *       500:
 *         description: Internal Server Error. Fallo al consultar la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener las sucursales"
 */

export async function GET( request: Request, 
        { params }: { params: Promise<{ id: string }> }
    ) {
    try {

        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión." },
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
        
        const {id} = await params;

        if(
            !/^[1-9][0-9]{0,18}$/.test(id) ||
            BigInt(id) > BigInt("9223372036854775807") 
        ){
            return NextResponse.json(
                { error: "ID de la sucursal no valido" },
                { status: 400 }
            )
        }
        const response = await pool.query(`
            SELECT * FROM sucursales
            WHERE branch_id = $1;
        `,
        [id]
        )

        if(response.rows.length === 0){
            return NextResponse.json(
                { error: "Sucursal inexistente o fuera del acceso del usuario" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { message: "Has obtenido la información de las sucursales con éxito.", data: response.rows },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "No se pudo obtener la información de las sucursales" },
            { status: 500 }
        )
    }
}