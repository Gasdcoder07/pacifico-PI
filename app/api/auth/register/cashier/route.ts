import { NextResponse } from "next/server";
import pool from "@/shared/lib/db";
import { readFileSync } from "fs";
import path from "path";
import { supabaseAdmin } from "@/shared/lib/supabase";
import { resend } from "@/shared/lib/resend";
import { RegisterResponse } from "../admin/route";
import { generateRandomPassword } from "@/shared/lib/password";

const logo = readFileSync(path.join(process.cwd(), "public", "pacifico-logo-email.png"));

/**
 * @swagger
 * /api/auth/register/cashier:
 *   post:
 *     summary: Registrar un nuevo cajero
 *     description: Permite a administradores (rol 1) y gerentes (rol 2) crear un cajero (rol 3) en su misma empresa. La contraseña se genera automáticamente y se envía solo al correo del usuario. Crea la cuenta en Supabase Auth con el correo confirmado e inserta su perfil en la tabla usuarios.
 *     tags:
 *       - Cajeros
 *     security:
 *       - BearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre(s) del cajero.
 *                 example: "Carlos"
 *               last_name:
 *                 type: string
 *                 description: Apellido(s) del cajero.
 *                 example: "Gómez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del cajero.
 *                 example: "carlos.cajero@empresa.com"
 *               branch_id:
 *                 type: integer
 *                 description: Sucursal a la que pertenece el cajero.
 *                 example: 1
 *               foto_url:
 *                 type: string
 *                 format: uri
 *                 description: URL de la foto de perfil. Opcional.
 *                 example: "https://midominio.com/foto.jpg"
 *               foto_public_id:
 *                 type: string
 *                 description: Identificador público de la foto de perfil. Opcional.
 *                 example: "usuarios/cajero_12345"
 *     responses:
 *       201:
 *         description: Cajero registrado exitosamente. La contraseña se envía únicamente al correo del cajero.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Haz creado tu usuario con éxito"
 *                 emailError:
 *                   type: string
 *                   description: Solo aparece si falló el envío del correo.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     company_id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Carlos"
 *                     last_name:
 *                       type: string
 *                       example: "Gómez"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "carlos.cajero@empresa.com"
 *                     rol_id:
 *                       type: integer
 *                       example: 3
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     foto_url:
 *                       type: string
 *                       format: uri
 *                       nullable: true
 *                       example: "https://midominio.com/foto.jpg"
 *       400:
 *         description: Faltan campos obligatorios o Supabase rechazó la creación del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               camposFaltantes:
 *                 value:
 *                   error: "Hace falta alguno de estos campos: (name, last_name, email)"
 *               errorSupabase:
 *                 value:
 *                   error: "Ha habido un error al crear usuario en SupaBase ..."
 *       401:
 *         description: Token ausente o usuario sin permisos para registrar cajeros.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               sinToken:
 *                 value:
 *                   error: "Error al obtener el token"
 *               sinPermisos:
 *                 value:
 *                   error: "No tienes permisos para registrar un nuevo Cajero"
 *       403:
 *         description: No se pudo validar la sesión con el token proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al adquirir la sesión actual"
 *       404:
 *         description: No existe un perfil asociado al usuario autenticado en la tabla usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener el usuario de la base de datos"
 *       500:
 *         description: Error inesperado en el servidor o al insertar el perfil en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hubo un error al registrar el usuario. ..."
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Error al obtener el token" },
                { status: 401 },
            );
        }

        const token = authHeader.replace("Bearer ", "");

        const {
            data: { user: authUser },
            error: authUserError,
        } = await supabaseAdmin.auth.getUser(token);

        if (!authUser || authUserError) {
            return NextResponse.json(
                { error: "Error al adquirir la sesión actual" },
                { status: 403 },
            );
        }

        const queryUser = await pool.query(
            `SELECT rol_id, company_id FROM usuarios WHERE auth_user_id = $1;`,
            [authUser.id],
        );
        const currentUser = queryUser.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Error al obtener el usuario de la base de datos" },
                { status: 404 },
            );
        }

        if (Number(currentUser.rol_id) !== 2 && Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permisos para registrar un nuevo Cajero" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { name, last_name, email, foto_public_id, foto_url, branch_id } = body;

        if (!name || !last_name || !email) {
            return NextResponse.json(
                { error: "Hace falta alguno de estos campos: (name, last_name, email)" },
                { status: 400 },
            );
        }

        const password = generateRandomPassword();

        const { data: authData, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    name,
                    last_name,
                    rol_id: 3,
                    company_id: currentUser.company_id,
                    branch_id,
                },
            });

        if (authError) {
            return NextResponse.json(
                { error: `Ha habido un error al crear usuario en SupaBase ${authError.message}` },
                { status: 400 },
            );
        }

        const userId = authData.user.id;

        const queryDB = `
            INSERT INTO public.usuarios (auth_user_id, company_id, name, last_name, email, rol_id, status, branch_id, foto_url, foto_public_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, company_id, name, last_name, email, rol_id, status, branch_id, foto_url;
        `;

        const values = [
            userId,
            currentUser.company_id,
            name,
            last_name,
            email,
            3,
            true,
            branch_id,
            foto_url || null,
            foto_public_id || null,
        ];

        const response = await pool.query(queryDB, values);

        const data: RegisterResponse = {
            message: "Haz creado tu usuario con éxito",
            usuario: response.rows[0],
        };

        try {
            const { error: emailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
                to: email,
                subject: "Creación de un usuario tipo cajero",
                html: `
                    <div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#334155;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
                        <div style="background:#06B6D4;padding:20px;text-align:center;">
                        <div style="display:inline-block;background:#FFFFFF;border-radius:10px;padding:8px 16px;">
                            <img src="cid:pacifico-logo" width="200" alt="Pacífico" style="display:block;">
                        </div>
                        </div>
                        <div style="padding:32px;">
                        <h1 style="margin:0 0 12px;font-size:24px;color:#164E63;">Hola, ${name}</h1>
                        <p style="margin:0 0 20px;font-size:16px;">Te has registrado correctamente en PACIFICO. Estos son tus datos de acceso:</p>
                        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px 20px;">
                            <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Correo</p>
                            <p style="margin:0 0 16px;font-size:16px;font-weight:bold;color:#164E63;">${email}</p>
                            <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Contraseña temporal</p>
                            <p style="margin:0;font-size:18px;font-weight:bold;font-family:Consolas,monospace;color:#164E63;">${password}</p>
                        </div>
                        </div>
                    </div>`,
                attachments: [
                    {
                        filename: "pacifico-logo.png",
                        content: logo,
                        contentId: "pacifico-logo",
                    },
                ],
            });

            if (emailError) {
                console.error(emailError.message);
                data.emailError = emailError.message;
            }
        } catch (err) {
            console.error(err);
            data.emailError = err instanceof Error ? err.message : String(err);
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: `Hubo un error al registrar el usuario. ${err}` },
            { status: 500 },
        );
    }
}