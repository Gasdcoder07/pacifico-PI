import { pool } from "@/lib/db"
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Consulta la base de datos y devuelve los detalles de un usuario específico usando su ID. Requiere autenticación mediante token JWT en los headers.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario a consultar
 *         schema:
 *           type: integer
 *           example: 37
 *     responses:
 *       200:
 *         description: Datos de cuenta recibidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de cuenta recibidos con éxito"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 37
 *                     nombre:
 *                       type: string
 *                       example: "Valentín"
 *                     apellido:
 *                       type: string
 *                       example: "Vaca"
 *                     correo:
 *                       type: string
 *                       example: "vvaca2@ucol.mx"
 *                     rol_id:
 *                       type: integer
 *                       example: 1
 *                     sucursal_id:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request. El ID proporcionado en la URL no es un número.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Haz ingresado un parámetro que no es un número"
 *       401:
 *         description: Unauthorized. Falta el token de sesión o el token es inválido/expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Sesión expirada o token inválido"
 *       404:
 *         description: Not Found. No se encontró un usuario con el ID especificado en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No existe un usuario con ese ID"
 *       500:
 *         description: Internal Server Error. Fallo en el servidor o error al ejecutar la consulta en PostgreSQL.
 */

export async function GET(
    request: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            )
        }
        
        const token = authHeader.split(" ")[1]
        
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
        
        if (authError || !authUser) {

            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            )
        }

        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id, 10)

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "Haz ingresado un parámetro que no es un número" },
                { status: 400 }
            )
        }

        const response = await pool.query(
            `SELECT * FROM usuarios WHERE id = $1`,
            [userId]
        )

        const user = response.rows[0]

        if (!user) {
            return NextResponse.json(
                { error: "No existe un usuario con ese ID" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Datos de cuenta recibidos con éxito", data: user },
            { status: 200 }
        )


    } catch ( err ) {
        console.error(err)
    }
}