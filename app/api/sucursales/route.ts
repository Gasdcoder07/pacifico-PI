import { NextResponse } from "next/server";
import { pool } from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";

/**
 * @swagger
 * components:
 *   schemas:
 *     Sucursal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Sucursal Centro"
 *         direction:
 *           type: string
 *           example: "Av. Principal 123"
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "3141234567"
 *         contact_info:
 *           type: string
 *           nullable: true
 *           example: "Horario de 9 AM a 6 PM"
 *         status:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-09-04T17:24:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-09-04T17:25:00Z"
 *         admin_id:
 *           type: integer
 *           nullable: true
 *           example: 5
 */

/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     summary: Obtener todas las sucursales
 *     description: Consulta y devuelve la lista completa de sucursales registradas.
 *     tags:
 *       - Sucursales
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sucursales recuperada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Has obtenido la información de las sucursales con éxito."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sucursal'
 *       401:
 *         description: No autorizado o token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No autorizado. Falta el token de sesión."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pudo obtener la información de las sucursales"
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión." },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const response = await pool.query(`
            SELECT * FROM sucursales;
        `);

        return NextResponse.json(
            { message: "Has obtenido la información de las sucursales con éxito.", data: response.rows },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "No se pudo obtener la información de las sucursales" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/sucursales:
 *   post:
 *     summary: Crear una nueva sucursal
 *     description: Permite únicamente a usuarios administradores (rol 1) registrar una nueva sucursal.
 *     tags:
 *       - Sucursales
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
 *               - direction
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sucursal Centro"
 *               direction:
 *                 type: string
 *                 example: "Av. Principal 123"
 *               phone:
 *                 type: string
 *                 example: "3141234567"
 *               contact_info:
 *                 type: string
 *                 example: "Horario de 9 AM a 6 PM"
 *     responses:
 *       201:
 *         description: Sucursal creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: 'Sucursal "Sucursal Centro" creada con éxito'
 *                 data:
 *                   $ref: '#/components/schemas/Sucursal'
 *       400:
 *         description: Datos obligatorios faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El nombre y la dirección son campos obligatorios"
 *       401:
 *         description: No autorizado o token inválido.
 *       403:
 *         description: Permisos insuficientes (requiere rol de administrador).
 *       404:
 *         description: Usuario no encontrado en el sistema.
 *       500:
 *         description: Error interno del servidor.
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.match(/^Bearer\s+(\S+)$/i)?.[1];

        if (!token) {
            return NextResponse.json(
                { error: "No autorizado. Falta token de sesión" },
                { status: 401 }
            );
        }

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, rol_id FROM public.usuarios WHERE auth_user_id = $1 AND status = true`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo en el sistema" },
                { status: 404 }
            );
        }

        if (Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permisos de administrador para crear sucursales" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, direction, phone, contact_info } = body;

        if (!name || !direction) {
            return NextResponse.json(
                { error: "El nombre y la dirección son campos obligatorios" },
                { status: 400 }
            );
        }

        const response = await pool.query(
            `INSERT INTO public.sucursales (
                name,
                direction,
                phone,
                contact_info,
                created_at,
                updated_at,
                admin_id
            ) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)
            RETURNING id, name, direction, phone, contact_info, status, created_at, updated_at, admin_id;`,
            [
                name,
                direction,
                phone || null,
                contact_info || null,
                currentUser.id
            ]
        );

        return NextResponse.json(
            { success: `Sucursal "${name}" creada con éxito`, data: response.rows[0] },
            { status: 201 }
        );

    } catch (err) {
        console.error("Error al crear sucursal:", err);
        return NextResponse.json(
            { error: "Error interno en el servidor al crear la sucursal" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/sucursales/{id}:
 *   delete:
 *     summary: Eliminar una sucursal
 *     description: Elimina una sucursal por su ID. Solo accesible por administradores (rol 1) o el encargado asignado a dicha sucursal (rol 2).
 *     tags:
 *       - Sucursales
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID numérico de la sucursal a eliminar.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Sucursal y registros asociados eliminados con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sucursal y todos sus registros asociados eliminados exitosamente"
 *       400:
 *         description: ID de sucursal no válido.
 *       401:
 *         description: No autorizado o token inválido.
 *       403:
 *         description: Permisos insuficientes para eliminar esta sucursal.
 *       404:
 *         description: La sucursal o el usuario no existe.
 *       500:
 *         description: Error interno del servidor.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: branch_id } = await params;

        if (!/^[1-9][0-9]*$/.test(branch_id)) {
            return NextResponse.json(
                { error: "ID de sucursal no válido" },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.match(/^Bearer\s+(\S+)$/i)?.[1];

        if (!token) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            );
        }

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, rol_id, branch_id FROM public.usuarios WHERE auth_user_id = $1 AND status = true`,
            [authUser.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se ha encontrado un usuario activo asociado a esta sesión" },
                { status: 404 }
            );
        }

        const userRolId = Number(currentUser.rol_id);
        const userBranchId = Number(currentUser.branch_id);
        const targetBranchId = Number(branch_id);

        const isAdmin = userRolId === 1;
        const isBranchOwner = userRolId === 2 && userBranchId === targetBranchId;

        if (!isAdmin && !isBranchOwner) {
            return NextResponse.json(
                { error: "No tienes permisos para eliminar esta sucursal" },
                { status: 403 }
            );
        }

        const deleteResult = await pool.query(
            `DELETE FROM public.sucursales WHERE id = $1 RETURNING id`,
            [targetBranchId]
        );

        if (deleteResult.rowCount === 0) {
            return NextResponse.json(
                { error: "La sucursal no existe o ya fue eliminada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Sucursal y todos sus registros asociados eliminados exitosamente" },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error al eliminar sucursal:", err);
        return NextResponse.json(
            { error: "Error interno al procesar la eliminación" },
            { status: 500 }
        );
    }
}