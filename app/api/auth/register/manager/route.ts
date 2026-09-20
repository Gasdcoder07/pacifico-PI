import { NextResponse } from "next/server";
import pool from "@/shared/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Registrar un nuevo administrador
 *     description: Crea un usuario con rol de administrador (rol_id 2) en Supabase Auth mediante el trigger y actualiza su foto de perfil en la tabla de usuarios.
 *     tags:
 *       - Administradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre(s) del administrador.
 *                 example: "Carlos"
 *               last_name:
 *                 type: string
 *                 description: Apellido(s) del administrador.
 *                 example: "Gómez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico.
 *                 example: "carlos.admin@empresa.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña segura (mínimo 6 caracteres, 1 mayúscula, 1 símbolo).
 *                 example: "Admin_123"
 *               foto_url:
 *                 type: string
 *                 description: URL de la foto de perfil (Opcional).
 *                 example: "https://midominio.com/foto.jpg"
 *               foto_public_id:
 *                 type: string
 *                 description: ID público de la imagen en el storage (Opcional).
 *                 example: "foto_12345"
 *     responses:
 *       201:
 *         description: Administrador creado con éxito. Devuelve el perfil actualizado de la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Haz creado tu usuario con éxito"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     nombre:
 *                       type: string
 *                       example: "Carlos"
 *                     apellido:
 *                       type: string
 *                       example: "Gómez"
 *                     correo:
 *                       type: string
 *                       example: "carlos.admin@empresa.com"
 *                     rol_id:
 *                       type: integer
 *                       example: 2
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     foto_url:
 *                       type: string
 *                       example: "https://midominio.com/foto.jpg"
 *       400:
 *         description: Bad Request. Faltan datos, la contraseña no cumple con los requisitos o hubo un error al crear en Supabase.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hace falta alguno de estos campos: (name, last_name, email, password)"
 *       500:
 *         description: Internal Server Error. Fallo inesperado en el servidor o base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hubo un error al registrar el usuario. Error: ..."
 */

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, last_name, email, password, foto_public_id, foto_url } = body;

        if (!name || !last_name || !email || !password) {
            return NextResponse.json(
                { error: "Hace falta alguno de estos campos: (name, last_name, email, password)" },
                { status: 400 }
            )
        }

        const regexPass = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

        if (!regexPass.test(password)) {
            return NextResponse.json(
                { error: "La contraseña no es suficientemente segura: \n1.- 6 caracteres como mínimo\n2.- Un símbolo\n3.- Una mayúscula" },
                { status: 400 }
            )
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                name: name,
                last_name: last_name,
                rol_id: 2
            }
        })

        if (authError) {
            return NextResponse.json(
                { error: `Ha habido un error al crear usuario en SupaBase ${authError.message}` },
                { status: 400 }
            )
        }

        const userId = authData.user.id

        const queryDB = `
            UPDATE public.usuarios 
            SET 
                foto_url = $2,
                foto_public_id = $3
            WHERE auth_user_id = $1
            RETURNING id, name, last_name, email, rol_id, status, foto_url;
        `

        const values = [userId, foto_url || null, foto_public_id]

        const response = await pool.query(queryDB, values)

        return NextResponse.json(
            { message: "Haz creado tu usuario con éxito", usuario: response.rows[0] },
            { status: 201 }
        )

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: `Hubo un error al registrar el usuario. ${err}` },
            { status: 500 }
        )
    }
}