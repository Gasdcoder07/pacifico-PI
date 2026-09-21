import { pool } from "@/shared/lib/db"
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     description: Consulta la base de datos y devuelve los detalles de un usuario específico usando su ID. Requiere autenticación mediante token JWT en los headers.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *     summary: Obtener un usuario por ID
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

export async function PUT(
    request: Request,
    { params } : { params: Promise<{ id: string }> }   
) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No estás autorizado para realizar esta petición" },
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

        const currentUserQuery = await pool.query(
            `SELECT id, rol_id FROM usuarios WHERE auth_user_id = $1`,
            [authUser.id]
        )

        const currentUser = currentUserQuery.rows[0]

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se encontró un perfil de usuario asociado a esta sesión" },
                { status: 404 }
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

        const body = await request.json();

        if (body.rol_id !== undefined) {
            const newRolId = parseInt(body.rol_id, 10)

            if (Number(currentUser.id) === userId) {
                return NextResponse.json(
                    { error: "No puedes modificar tu propio rol_id" },
                    { status: 400 }
                )
            }

            if (Number(currentUser.rol_id) !== 1) {
                return NextResponse.json(
                    { error: "No tienes permiso de modificar el rol_id dado que no eres administrador" },
                    { status: 403 }
                )
            }

            if (newRolId === 1) {
                return NextResponse.json(
                    { error: "No puedes hacer administrador a alguien dado que ya eres tú el administrador" },
                    { status: 400 }
                )
            }
        }

        const allowedFields = <string[]>[
            "name",
            "last_name",
            "email",
            "status",
            "foto_url",
            "rol_id",
            "branch_id",
            "admin_id",
            "manager_id"
        ];

        const updates: string[] = []
        const values: unknown[] = []
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex}`)
                values.push(body[field])
                paramIndex++;
            }
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: "No se enviaron campos válidos para  actualizar" },
                { status: 400 }
            )
        }

        updates.push(`updated_at = NOW()`)

        values.push(userId)
        const whereIndex = paramIndex;

        const query = `
            UPDATE usuarios
            SET ${updates.join(", ")}
            WHERE id = $${whereIndex}
            RETURNING *;
        `

        const response = await pool.query(query, values)
        const updatedUser = response.rows[0]

        if (!updatedUser) {
        return NextResponse.json(
            { error: "No existe un usuario con ese ID" },
            { status: 404 }
        );
        }

        return NextResponse.json(
        {
            message: "Usuario actualizado con éxito",
            data: updatedUser,
        },
        { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: `Error interno en el endpoint ${err}` },
            { status: 500 }
        )
    }
}