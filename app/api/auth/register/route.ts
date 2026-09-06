import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta de usuario nueva usando Supabase Auth y adjunta los metadatos iniciales (nombre, rol y sucursal).
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - correo
 *               - password
 *               - rol_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *                 description: Nombre completo del usuario
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@empresa.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "PasswordSeguro123"
 *                 description: Contraseña de la cuenta (mínimo de caracteres definido en Supabase)
 *               rol_id:
 *                 type: string
 *                 example: "2"
 *                 description: ID del rol que tendrá el usuario
 *               sucursal_id:
 *                 type: string
 *                 example: "5"
 *                 description: ID de la sucursal (opcional)
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 user:
 *                   type: object
 *                   description: Datos del usuario devueltos por Supabase Auth
 *       400:
 *         description: Bad Request. Faltan datos requeridos o Supabase rechazó la creación (ej. el correo ya existe o la contraseña es muy débil).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan campos obligatorios (nombre, correo, password, rol_id)"
 *       500:
 *         description: Internal Server Error. Fallo inesperado en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errror:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, last_name, email, password, rol_id, branch_id } = body;

        if (!name || !last_name || !email || !password || !rol_id){
            return NextResponse.json(
                { error: 'Faltan campos obligatorios (nombre, apellido, correo, password, rol_id)' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
                data: {
                    nombre: name,
                    apellido: last_name,
                    rol_id,
                    sucursal_id: branch_id 
                    ? branch_id.toString() 
                    : null,
                }
            }
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(
            { message: 'Usuario registrado exitosamente', user: data.user },
            { status: 201 }
        )

    } catch (err) {
        console.error("Ha ocurrido un error, el cual es: ", err)
        return NextResponse.json( { errror: "Error interno del servidor" }, { status: 500 } )
    }
}