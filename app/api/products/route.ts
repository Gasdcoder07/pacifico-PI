import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Sabritas Sal 170g"
 *         description:
 *           type: string
 *           example: "Papas fritas con sal"
 *         price:
 *           type: number
 *           format: float
 *           example: 25.50
 *         category_id:
 *           type: integer
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-09-04T17:24:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-09-04T17:25:00Z"
 *         foto_public_id:
 *           type: string
 *           nullable: true
 *           example: "productos/sabritas_123"
 *         foto_url:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/v12345/sabritas.jpg"
 *         admin_id:
 *           type: integer
 *           example: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Mensaje descriptivo del error"
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Permite únicamente a usuarios administradores (rol 1) registrar un nuevo producto en el sistema.
 *     tags:
 *       - Productos
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
 *               - description
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sabritas Sal 170g"
 *               description:
 *                 type: string
 *                 example: "Papas fritas con sal"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               foto_public_url:
 *                 type: string
 *                 example: "productos/sabritas_123"
 *               foto_url:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/v12345/sabritas.jpg"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: 'Has creado el producto Sabritas Sal 170g con éxito'
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Campos obligatorios faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Hacen falta campos obligatorios"
 *       401:
 *         description: No autorizado o token de sesión inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Hace falta token de sesión"
 *       403:
 *         description: Permisos insuficientes (requiere rol de administrador).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "No tienes permiso para realizar esta acción"
 *       404:
 *         description: Usuario no encontrado en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "No existe usuario linkeado con esta sesión"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error interno en el servidor al crear el producto"
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.match(/^Bearer\s+(\S+)$/i)?.[1];

        if (!token) {
            return NextResponse.json(
                { error: "Hace falta token de sesión" },
                { status: 401 }
            );
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (!user || authError) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const currentUserQuery = await pool.query(
            `SELECT id, rol_id FROM usuarios WHERE auth_user_id = $1 AND status = true;`,
            [user.id]
        );

        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return NextResponse.json(
                { error: "No existe usuario linkeado con esta sesión" },
                { status: 404 }
            );
        }

        if (Number(currentUser.rol_id) !== 1) {
            return NextResponse.json(
                { error: "No tienes permiso para realizar esta acción" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, description, price, category_id, foto_public_url, foto_url } = body;

        if (!name || !description || price === undefined || price === null || !category_id) {
            return NextResponse.json(
                { error: "Hacen falta campos obligatorios" },
                { status: 400 }
            );
        }

        const response = await pool.query(
            `INSERT INTO productos (
                name,
                description,
                price,
                category_id,
                created_at,
                updated_at,
                foto_public_id,
                foto_url,
                admin_id
            ) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6, $7)
            RETURNING id, name, description, price, category_id, created_at, updated_at, foto_public_id, foto_url, admin_id;`,
            [name, description, price, category_id, foto_public_url || null, foto_url || null, currentUser.id]
        );

        const resolvedResponse = response.rows[0];

        if (!resolvedResponse) {
            return NextResponse.json(
                { error: "Error al generar tu producto nuevo" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: `Has creado el producto ${name} con éxito`, data: resolvedResponse },
            { status: 201 }
        );

    } catch (err) {
        console.error("Error al crear producto:", err);
        return NextResponse.json(
            { error: "Error interno en el servidor al crear el producto" },
            { status: 500 }
        );
    }
}