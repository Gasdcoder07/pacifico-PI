import pool from "@/shared/lib/db";
import next from "next";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Obtener inventario de una sucursal
 *     description: Retorna el inventario de una sucursal, incluyendo los detalles del producto y sus cantidades.
 *     tags:
 *       - Inventario
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Operación exitosa. Devuelve [] si no hay resultados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branch_id:
 *                     type: integer
 *                     example: "1"
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
 *                         min_stock:
 *                           type: integer
 *                           example: 5
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-09-17T15:00:00.000Z"
 *       404:
 *         description: Sucursal inexistente o fuera del acceso del usuario
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

export async function GET (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
            return NextResponse.json(
                { error: "No autorizado, falta token de acceso" },
                { status: 401 }
            )
        }

        const { id } = await params;

        if(
            !/^[1-9][0-9]{0,18}$/.test(id) ||
            BigInt(id) > BigInt("9223372036854775807") 
        ){
            return NextResponse.json(
                { error: "ID de la sucursal no valido" },
                { status: 400 }
            )
        }
        
        const query = `
            SELECT 
                i.branch_id::text AS branch_id,
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
                ORDER BY i.id
                ) AS productos
            FROM public.inventario i
            INNER JOIN public.productos p ON i.product_id = p.id
            WHERE i.branch_id = $1;
        `

        const { rows } = await pool.query(query,[id])

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
