import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obtener inventario de sucursales
 *     description: Retorna el inventario completo agrupado por sucursal, incluyendo los detalles del producto y sus cantidades.
 *     tags:
 *       - Inventario
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Operación exitosa. Devuelve el inventario agrupado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branch_id:
 *                     type: integer
 *                     example: 1
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         inventario_id:
 *                           type: integer
 *                           example: 15
 *                         product_id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: "Coca Cola 600ml"
 *                         foto_url:
 *                           type: string
 *                           nullable: true
 *                           example: "https://ejemplo.com/coca.jpg"
 *                         quantity:
 *                           type: integer
 *                           example: 25
 *                         stock_minimo:
 *                           type: integer
 *                           example: 5
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-09-17T15:00:00.000Z"
 *       401:
 *         description: No autorizado. Falta el token de acceso o es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No autorizado, falta token de acceso"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno en el backend"
 */

export async function GET (request: Request) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return NextResponse.json(
                { error: "No autorizado, falta token de acceso" },
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

        const query = `
            SELECT 
                i.branch_id,
                jsonb_agg(
                jsonb_build_object(
                    'inventario_id', i.id,
                    'product_id', i.product_id,
                    'name', p.name,
                    'foto_url', p.foto_url,
                    'quantity', i.quantity,
                    'min_stock', i.min_stock,
                    'updated_at', i.updated_at
                )
                ) as productos
            FROM public.inventario i
            INNER JOIN public.productos p ON i.product_id = p.id
            GROUP BY i.branch_id
            ORDER BY i.branch_id ASC;
        `

        const { rows } = await pool.query(query)

        return NextResponse.json(
            rows,
            { status: 200 }
        )

    } catch (err) {
        return NextResponse.json(
            { error: `Error interno en el backend ${err}` },
            { status: 500 }
        )
    }
}
