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

        const currentUserQuery = await pool.query(`
            SELECT rol_id, company_id from usuarios WHERE auth_user_id = $1;    
        `, [user.id])

        const currentUser = currentUserQuery.rows[0]

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se ha podido encontrar la información del usuario actual" },
                { status: 404 }
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
                    'description', p.description,
                    'price', p.price,
                    'quantity', i.quantity,
                    'min_stock', i.min_stock,
                    'updated_at', i.updated_at
                )
                ) as productos
            FROM public.inventario i
            INNER JOIN public.productos p ON i.product_id = p.id
            WHERE p.company_id = $1
            GROUP BY i.branch_id
            ORDER BY i.branch_id ASC;
        `

        const { rows } = await pool.query(query, [currentUser.company_id])

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

export async function POST(
    request: Request
) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No se pudo obtener el token de sesión" },
                { status: 401 }
            )
        }

        const token = authHeader.replace("Bearer ", "")

        const { data: { user: authUser  }, error: authError } = await supabase.auth.getUser(token)

        if (!authUser || authError) {
            return NextResponse.json(
                { error: "No se obtuvo el usuario de supabase" },
                { status: 401 }
            )
        }

        const currentUserQuery = await pool.query(
            `SELECT rol_id, company_id FROM usuarios WHERE auth_user_id=$1`,
            [authUser.id]
        )

        const currentUser = currentUserQuery.rows[0]

        const { branch_id, product_id, quantity = 0, min_stock = 5 } = await request.json()

        if (!branch_id || !product_id) {
            return NextResponse.json(
                { error: "Hacen falta datos necesarios" },
                { status: 400 }
            )
        }

        if (quantity < 0 || min_stock < 0) {
            return NextResponse.json(
                { error: 'La cantidad y el stock mínimo deben ser mayores o iguales a 0' },
                { status: 400 }
            )
        }

        const query = `
            INSERT INTO inventario (company_id, branch_id, product_id, quantity, min_stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `

        const values = [
            currentUser.company_id,
            branch_id,
            product_id,
            quantity,
            min_stock
        ]

        const response = await pool.query(query, values)

        if (!response) {
            return NextResponse.json(
                { error: "No se obtuvo respuesta" }
            )
        }

        const newInventory = response.rows[0]

        return NextResponse.json(
            { success: `Producto añadido exitosamente`, data: newInventory },
            { status: 201 }
        )
    } catch(err) {
        console.error(`Error al insertar en inventario: ${err}`)
        return NextResponse.json(
            { error: `Error interno del servidor ${err}` },
            { status: 500 }
        )
    }
}