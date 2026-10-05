import { NextResponse } from "next/server";
import { pool } from "@/shared/lib/db"
import { supabase } from "@/shared/lib/supabase";
import { validarAdmin } from "@/shared/utils/backend-funcs";

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