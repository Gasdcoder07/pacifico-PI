import { NextResponse } from "next/server";
import { readFileSync } from "fs"
import path from "path"
import pool from "@/shared/lib/db";
import { supabaseAdmin } from "@/shared/lib/supabase";
import { resend } from "@/shared/lib/resend";

const logo = readFileSync(path.join(process.cwd(), "public", "pacifico-logo-email.png"))

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Registrar un nuevo administrador
 *     description: Crea un usuario con rol de administrador (rol_id 1) en Supabase Auth mediante el trigger y actualiza su foto de perfil en la tabla de usuarios.
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
 *                       example: 1
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

export type RegisterResponse = {
  message: string;
  usuario: Record<string, unknown>;
  emailError?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      last_name,
      email,
      password,
      foto_public_id,
      foto_url,
      company_name,
      company_description,
      company_address,
      company_foto_public_id,
      company_foto_url,
    } = body;

    if (!name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "Hace falta alguno de estos campos: (name, last_name, email, password)" },
        { status: 400 },
      );
    }

    const regexPass = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    if (!regexPass.test(password)) {
      return NextResponse.json(
        {
          error:
            "La contraseña no es suficientemente segura: \n1.- 6 caracteres como mínimo\n2.- Un símbolo\n3.- Una mayúscula",
        },
        { status: 400 },
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      //email_confirm: true,
      user_metadata: {
        name: name,
        last_name: last_name,
        rol_id: 1,
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: `Ha habido un error al crear usuario en SupaBase ${authError.message}` },
        { status: 400 },
      );
    }

    const userId = authData.user.id;
    const client = await pool.connect();
    let usuario: Record<string, unknown>;

    try {
      await client.query("BEGIN");

      const insertEmpresaQuery = `
          INSERT INTO public.empresas (
              name,
              description,
              address,
              status,
              created_at,
              updated_at,
              foto_public_id,
              foto_url
          )
          VALUES ($1, $2, $3, true, NOW(), NOW(), $4, $5)
          RETURNING id;
      `;

      const resEmpresa = await client.query(insertEmpresaQuery, [
        company_name,
        company_description,
        company_address,
        company_foto_public_id || null,
        company_foto_url || null,
      ]);
      const companyId = resEmpresa.rows[0].id;

      const insertUsuarioQuery = `
                INSERT INTO public.usuarios (auth_user_id, company_id, name, last_name, email, rol_id, status, foto_url, foto_public_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, company_id, name, last_name, email, rol_id, status, foto_url;
            `;

      const userValues = [
        userId,
        companyId,
        name,
        last_name,
        email,
        1,
        true,
        foto_url || null,
        foto_public_id || null,
      ];

      const response = await client.query(insertUsuarioQuery, userValues);

      await client.query("COMMIT");

      usuario = response.rows[0];
    } catch (dbError) {
      await client.query("ROLLBACK");
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw dbError;
    } finally {
      client.release();
    }

    const data: RegisterResponse = {
      message: "Admin y empresa creados con éxito",
      usuario,
    };

    try {
      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: email,
        subject: "Creación de un nuevo usuario en PACIFICO",
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
                <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Contraseña</p>
                <p style="margin:0;font-size:18px;font-weight:bold;font-family:Consolas,monospace;color:#164E63;">${password}</p>
              </div>
              <div style="margin-top:20px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:6px;padding:14px 18px;font-size:14px;color:#78350F;">
                <strong>Guarda estos datos en un lugar seguro.</strong> Si los pierdes tendrás que pedir que restablezcan tu contraseña. No compartas este correo con nadie.
              </div>
            </div>
          </div>
        `,
        text: `Hola ${name}, te has registrado correctamente en PACIFICO.`,
        attachments: [
          {
            filename: "pacifico-logo.png",
            content: logo,
            contentId: "pacifico-logo"
          }
        ]
      });

      if (emailError) {
        console.error(emailError);
        data.emailError = "No se pudo enviar el correo de bienvenida";
      }
    } catch (emailException) {
      console.error(emailException);
      data.emailError = "No se pudo enviar el correo de bienvenida";
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

