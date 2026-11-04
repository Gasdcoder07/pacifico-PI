import { NextResponse } from "next/server";
import pool from "@/shared/lib/db";
import { supabase, supabaseAdmin } from "@/shared/lib/supabase";
import { resend } from "@/shared/lib/resend";
import { readFileSync } from "fs";
import path from "path";
import { RegisterResponse } from "../admin/route";
import { generateRandomPassword } from "@/shared/lib/password";

const logo = readFileSync(path.join(process.cwd(), "public", "pacifico-logo-email.png"));

/**
 * @swagger
 * /api/auth/register/manager:
 *   post:
 *     summary: Registrar un nuevo gerente
 *     description: Permite a administradores (rol 1) crear un gerente (rol 2) en su misma empresa. La contraseña se genera automáticamente y se envía solo al correo del usuario. Crea la cuenta en Supabase Auth con el correo confirmado e inserta su perfil en la tabla usuarios.
 *     tags:
 *       - Gerentes
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
 *                 description: Nombre(s) del gerente.
 *                 example: "Carlos"
 *               last_name:
 *                 type: string
 *                 description: Apellido(s) del gerente.
 *                 example: "Gómez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico.
 *                 example: "carlos.gerente@empresa.com"
 *               branch_id:
 *                 type: integer
 *                 description: Sucursal a la que pertenece el gerente.
 *                 example: 1
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
 *         description: Gerente creado con éxito. La contraseña se envía únicamente al correo del gerente.
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
 *                       example: "carlos.gerente@empresa.com"
 *                     rol_id:
 *                       type: integer
 *                       example: 2
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     branch_id:
 *                       type: integer
 *                       example: 1
 *                     foto_url:
 *                       type: string
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
 *         description: Token ausente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener la sesión del usuario"
 *       403:
 *         description: El usuario autenticado no tiene permisos para registrar gerentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No tienes permisos para registrar un nuevo Gerente"
 *       404:
 *         description: El token no corresponde a un usuario, o no existe un perfil asociado en la tabla usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               tokenInvalido:
 *                 value:
 *                   error: "No se ha podido obtener un usuario con el token"
 *               sinPerfil:
 *                 value:
 *                   error: "Error al obtener el usuario de la base de datos"
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
                { error: "Error al obtener la sesión del usuario" },
                { status: 401 },
            );
        }

        const token = authHeader.replace("Bearer ", "");

        const {
            data: { user: authUser },
            error: authErrorUser,
        } = await supabase.auth.getUser(token);

        if (!authUser || authErrorUser) {
            return NextResponse.json(
                { error: "No se ha podido obtener un usuario con el token" },
                { status: 404 },
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT rol_id, company_id FROM usuarios WHERE auth_user_id = $1`,
            [authUser.id],
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Error al obtener el usuario de la base de datos" },
                { status: 404 },
            );
        }

        if (Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permisos para registrar un nuevo Gerente" },
                { status: 403 },
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
                    rol_id: 2,
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
            2,
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
                subject: "Creación de un usuario tipo Gerente",
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
                        <div style="margin-top:20px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:6px;padding:14px 18px;font-size:14px;color:#78350F;">
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