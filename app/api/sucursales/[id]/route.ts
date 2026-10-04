import { NextResponse } from "next/server";
import { pool } from "@/shared/lib/db"
import { supabase } from "@/shared/lib/supabase";

/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     summary: Obtener todas las sucursales
 *     description: Consulta la base de datos y devuelve una lista con todos los registros de la tabla sucursales.
 *     tags:
 *       - Sucursales
 *     responses:
 *       200:
 *         description: Lista de sucursales recuperada exitosamente.
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

async function validarAdmin(request: Request, id: string) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!token) {
        return NextResponse.json(
            { error: "Falta el token de sesión" },
            { status: 401 }
        );
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return NextResponse.json(
        { error: "Sesión expirada o token inválido" },
        { status: 401 }
        );
    }

    if (
        !/^[1-9][0-9]{0,18}$/.test(id) ||
        BigInt(id) > BigInt("9223372036854775807")
    ) {
        return NextResponse.json(
        { error: "ID de sucursal no válido" },
        { status: 400 }
        );
    }

    const { rows } = await pool.query(
        `SELECT id::text
        FROM public.usuarios
        WHERE auth_user_id = $1
        AND rol_id = 1
        AND status = true`,
        [user.id]
    );

    if (!rows[0]) {
        return NextResponse.json(
            { error: "Solo un administrador activo puede realizar esta operación" },
            { status: 403 }
        );
    }
    return rows[0].id as string;
}

export async function GET( request: Request ) {
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

        const response = await pool.query(`
            SELECT * FROM sucursales;
        `)

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
/**
 * @swagger
 * /api/sucursales/{id}:
 *   put:
 *     summary: Modificar una sucursal propia
 *     tags: [Sucursales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, direccion, estado]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Sucursal Centro
 *               direccion:
 *                 type: string
 *                 example: Av. Principal 123
 *               telefono:
 *                 type: string
 *                 nullable: true
 *                 example: "3141257959"
 *               info_contacto:
 *                 type: string
 *                 nullable: true
 *                 example: Atención de lunes a sábado
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Sucursal actualizada. Devuelve message y data.
 *       400:
 *         description: ID, JSON o campos no válidos.
 *       401:
 *         description: Sesión inválida.
 *       403:
 *         description: Se requiere una cuenta ADMIN activa.
 *       404:
 *         description: Sucursal inexistente o que no pertenece al administrador.
 *       500:
 *         description: Error interno del servidor.
 */

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = await validarAdmin(request, id);

    if (adminId instanceof NextResponse) {
        return adminId;
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json(
            { error: "Debes enviar un objeto JSON" },
            { status: 400 }
        );
    }

    const { nombre, direccion, telefono, info_contacto, estado } = body;

    if (
        typeof nombre !== "string" || !nombre.trim() ||
        typeof direccion !== "string" || !direccion.trim() ||
        typeof estado !== "boolean" ||
        (telefono != null && typeof telefono !== "string") ||
        (info_contacto != null && typeof info_contacto !== "string")
    ) {
        return NextResponse.json(
            { error: "Revisa nombre, dirección, teléfono, contacto y estado" },
            { status: 400 }
        );
    }

    const response = await pool.query(
        `UPDATE public.sucursales
        SET nombre = $1,
            direccion = $2,
            telefono = $3,
            info_contacto = $4,
            estado = $5,
            updated_at = now()
        WHERE id = $6 AND admin_id = $7
        RETURNING *`,
        [
            nombre.trim(),
            direccion.trim(),
            telefono?.trim() || null,
            info_contacto?.trim() || null,
            estado,
            id,
            adminId,
        ]
    );

    if (!response.rows[0]) {
        return NextResponse.json(
            { error: "Sucursal no encontrada en tu cuenta" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            message: "Sucursal actualizada con éxito",
            data: response.rows[0],
        },
        { status: 200 }
    );
    } catch (error) {
    if (error instanceof SyntaxError) {
        return NextResponse.json(
            { error: "El JSON enviado no es válido" },
            { status: 400 }
        );
    }

    console.error("Error al modificar sucursal:", error);

    return NextResponse.json(
        { error: "No se pudo modificar la sucursal" },
        { status: 500 }
        );
    }
}
/**
 * @swagger
 * /api/sucursales/{id}:
 *   delete:
 *     summary: Eliminar una sucursal propia
 *     tags: [Sucursales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Sucursal eliminada. Devuelve message.
 *       400:
 *         description: ID no válido.
 *       401:
 *         description: Sesión inválida.
 *       403:
 *         description: Se requiere una cuenta ADMIN activa.
 *       404:
 *         description: Sucursal inexistente o que no pertenece al administrador.
 *       409:
 *         description: Existen registros relacionados que impiden eliminarla.
 *       500:
 *         description: Error interno del servidor.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const adminId = await validarAdmin(request, id);

    if (adminId instanceof NextResponse) {
        return adminId;
    }

    const response = await pool.query(
        `DELETE FROM public.sucursales
        WHERE id = $1 AND admin_id = $2
        RETURNING id`,
        [id, adminId]
    );

    if (!response.rows[0]) {
        return NextResponse.json(
            { error: "Sucursal no encontrada en tu cuenta" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: "Sucursal eliminada con éxito" },
        { status: 200 }
    );
    } catch (error) {
    if ((error as { code?: string } | null)?.code === "23503") {
        return NextResponse.json(
            {
            error: "La sucursal tiene registros relacionados. Puedes desactivarla en lugar de eliminarla.",
            },
            { status: 409 }
        );
    }

    console.error("Error al eliminar sucursal:", error);

    return NextResponse.json(
        { error: "No se pudo eliminar la sucursal" },
        { status: 500 }
        );
    }
}