import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario mediante Supabase Auth y recupera la información de su perfil desde la tabla usuarios.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@empresa.com
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MiPassword123"
 *                 description: Contraseña de la cuenta
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve la sesión de Supabase y el perfil del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 session:
 *                   type: object
 *                   description: Objeto de sesión de Supabase Auth
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     nombre:
 *                       type: string
 *                     correo:
 *                       type: string
 *                     rol_id:
 *                       type: string
 *                     sucursal_id:
 *                       type: string
 *                     estado:
 *                       type: boolean
 *       400:
 *         description: Bad Request. Faltan el correo o la contraseña en el body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error, hace faltan datos para poder entrar ( Usuario, Contraseña )"
 *       401:
 *         description: Unauthorized. Credenciales inválidas o error en Supabase Auth.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid login credentials"
 *                 code:
 *                   type: string
 *                 status:
 *                   type: integer
 *       403:
 *         description: Forbidden. La cuenta del usuario está inactiva.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La cuenta del usuario está inactiva"
 *       404:
 *         description: Not Found. El usuario se autenticó pero no existe su perfil en la tabla 'usuarios'.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se encontró el perfil en la base de datos"
 *                 detalle:
 *                   type: string
 *       500:
 *         description: Internal Server Error. Fallo inesperado en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: integer
 */
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Error, hace faltan datos para poder entrar ( Usuario, Contraseña )" },
                { status: 400 }
            )
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (authError || !authData) {
            return NextResponse.json(
                {   error: authError?.message,
                    code: authError?.code,
                    status: authError?.status },
                { status: 401 }
            )
        }
        const { data: perfilUsuario, error: perfilError } = await supabase
            .from('usuarios')
            .select('id, nombre,apellido, correo, rol_id, sucursal_id, estado')
            .eq('auth_user_id', authData.user.id)
            .single();

        console.log('Perfil del usuario obtenido: ', perfilUsuario, 'Error al obtener el perfil: ', perfilError)

        if (perfilError || !perfilUsuario) {
            return NextResponse.json(
                { error: 'No se encontró el perfil en la base de datos', detalle: perfilError?.message || 'Perfil no encontrado' },
                { status: 404 }
            )
        }

        if (!perfilUsuario.estado) {
            return NextResponse.json(
                { error: "La cuenta del usuario está inactiva" },
                { status: 403 }
            )
        }

        return NextResponse.json(
            {message: 'Login exitoso', session: authData.session, usuario: perfilUsuario}, 
                {status: 200}
        )
        
    } catch(err) {
        console.error('Error en el endpoint de login: ', err)
        return NextResponse.json(
            { error: `Error interno del servidor: ${err}`, status: 500 }
        )
    }
}