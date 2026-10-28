import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { fromCents, toCents } from "@/shared/utils/formatters";
import { NextResponse } from "next/server";

interface ItemVenta {
    idProducto: number
    quantity: number
}

interface PayloadVentas {
    pay_method: number,
    productsIds: ItemVenta[]
}

const taxRate = Number(process.env.TAX_RATE)

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registrar una venta
 *     description: >
 *       Registra una venta en la sucursal del usuario autenticado. Valida rol,
 *       sucursal, método de pago, existencia de productos y stock disponible;
 *       calcula subtotal, IVA y total; inserta la venta y su detalle, y descuenta
 *       el inventario dentro de una transacción. Solo cajeros y gerentes pueden vender.
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pay_method
 *               - productsIds
 *             properties:
 *               pay_method:
 *                 type: integer
 *                 description: ID del método de pago (debe pertenecer a la empresa del usuario)
 *                 example: 1
 *               productsIds:
 *                 type: array
 *                 minItems: 1
 *                 description: Productos a vender. Si un producto se repite, sus cantidades se suman.
 *                 items:
 *                   type: object
 *                   required:
 *                     - idProducto
 *                     - quantity
 *                   properties:
 *                     idProducto:
 *                       type: integer
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 venta:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "120"
 *                     company_id:
 *                       type: string
 *                       example: "1"
 *                     branch_id:
 *                       type: string
 *                       example: "3"
 *                     cashier_id:
 *                       type: string
 *                       example: "8"
 *                     payment_method_id:
 *                       type: string
 *                       example: "1"
 *                     subtotal:
 *                       type: string
 *                       example: "200.00"
 *                     tax_rate:
 *                       type: string
 *                       example: "0.16"
 *                     tax_amount:
 *                       type: string
 *                       example: "32.00"
 *                     total:
 *                       type: string
 *                       example: "232.00"
 *                     sale_date:
 *                       type: string
 *                       format: date-time
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                 detalle:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "450"
 *                       company_id:
 *                         type: string
 *                         example: "1"
 *                       sale_id:
 *                         type: string
 *                         example: "120"
 *                       product_id:
 *                         type: string
 *                         example: "5"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       unit_price:
 *                         type: string
 *                         example: "100.00"
 *                       subtotal:
 *                         type: string
 *                         example: "200.00"
 *       400:
 *         description: La venta no tiene productos, o algún producto o cantidad es inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Producto o cantidad inválida
 *       401:
 *         description: Token ausente, mal formado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se pudo obtener el tóken de sesión
 *       403:
 *         description: El rol del usuario no tiene permitido registrar ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Solo cajeros y gerentes tienen permitido realizar compras
 *       404:
 *         description: Usuario, sucursal, método de pago o productos inexistentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Algunos productos no existen o están inactivos
 *                 faltantes:
 *                   type: array
 *                   description: IDs de productos no encontrados (solo cuando aplica)
 *                   items:
 *                     type: integer
 *                   example: [7, 12]
 *       409:
 *         description: Stock insuficiente en la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Stock insuficiente en la sucursal
 *                 sinStock:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 5
 *                       solicitado:
 *                         type: integer
 *                         example: 10
 *                       disponible:
 *                         type: integer
 *                         example: 3
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ha ocurrido un error en el backend
 */
export async function POST(request: Request) {
    try {
        const authHeader = await request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No se pudo obtener el tóken de sesión" },
                { status: 401 }
            )
        }

        const token = authHeader.split(" ")[1]

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

        if (!authUser || authError) {
            return NextResponse.json(
                { error: authError?.message },
                { status: 401 }
            )
        }

        const currentUserQuery = await pool.query(`
            SELECT rol_id, branch_id, id, company_id FROM public.usuarios WHERE auth_user_id = $1    
        `, [authUser.id])

        const currentUser = currentUserQuery.rows[0]

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se pudo obtener el usuario de la base de datos" },
                { status: 404 }
            )
        }

        const { pay_method, productsIds } : PayloadVentas = await request.json()

        const branch = (await pool.query("SELECT * FROM sucursales WHERE id = $1 AND company_id = $2", [currentUser.branch_id, currentUser.company_id])).rows[0]
        const payMethod = (await pool.query("SELECT * FROM metodos_pago WHERE id = $1 AND company_id = $2", [pay_method, currentUser.company_id])).rows[0]

        if (![2,3].includes(Number(currentUser.rol_id))) {
            return NextResponse.json(
                { error: "Solo cajeros y gerentes tienen permitido realizar compras" },
                { status: 403 }
            )
        }

        if (!branch || !payMethod) {
            return NextResponse.json(
                { error: "Rama o Método de pago inexistentes" },
                { status: 404 }
            )
        }

        if (!Array.isArray(productsIds) || productsIds.length === 0) {
            return NextResponse.json(
                { error: "La venta no tiene productos" },
                { status: 400 }
            )
        }

        const cantidades = new Map<number, number>()

        for (const { idProducto, quantity } of productsIds) {
            if (!Number.isInteger(idProducto) || !Number.isInteger(quantity) || quantity <= 0) {
                return NextResponse.json(
                    { error: "Producto o cantidad inválida" },
                    { status: 400 }
                )
            }
            cantidades.set(idProducto, (cantidades.get(idProducto) ?? 0) + quantity)
        }

        const ids = [...cantidades.keys()]

        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            const { rows: productos } = await client.query(
                `SELECT id, name, price
                    FROM productos
                WHERE id = ANY($1::bigint[])
                    AND company_id = $2
                    AND status = true
                `, [ids, currentUser.company_id]
            )

            if (productos.length !== ids.length) {
                const encontrados = new Set(productos.map(p => Number(p.id)))
                const faltantes = ids.filter(id => !encontrados.has(id))
                await client.query("ROLLBACK")
                return NextResponse.json(
                    { error: "Algunos productos no existen o están inactivos", faltantes },
                    { status: 404 }
                )
            }

            const { rows: inventario } = await client.query(`
                SELECT product_id, quantity
                    FROM inventario
                WHERE branch_id = $1
                    AND company_id = $2
                    AND product_id = ANY($3::bigint[])
                FOR UPDATE`, 
                [currentUser.branch_id, currentUser.company_id, ids]
            )

            const stock = new Map(inventario.map(r => [Number(r.product_id), r.quantity as number]))

            const sinStock = ids
                .filter(id => (stock.get(id) ?? 0) < cantidades.get(id)!)
                .map(id => ({
                    product_id: id,
                    solicitado: cantidades.get(id),
                    disponible: stock.get(id) ?? 0
                }))
            
            if (sinStock.length > 0) {
                await client.query("ROLLBACK")
                return NextResponse.json(
                    { error: "Stock insuficiente en la sucursal", sinStock },
                    { status: 409 }
                )
            }

            const precios = new Map(productos.map(p => [Number(p.id), p.price as string]))

            const detalle = ids.map(id => {
                const quantity = cantidades.get(id)!
                const unitCents = toCents(precios.get(id)!)
                return {
                    product_id: id,
                    quantity,
                    unitCents,
                    subtotalCents: unitCents * quantity
                }
            })

            const subtotalCents = detalle.reduce((acc, d) => acc + d.subtotalCents, 0)

            const taxCents = Math.round(subtotalCents * taxRate)

            const totalCents = subtotalCents + taxCents

            const { rows: [venta] } = await client.query(
                `INSERT INTO ventas
                    (company_id, branch_id, cashier_id, payment_method_id,
                    subtotal, tax_rate, tax_amount, total)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
                 [
                    currentUser.company_id,
                    currentUser.branch_id,
                    currentUser.id,
                    payMethod.id,
                    fromCents(subtotalCents),
                    taxRate,
                    fromCents(taxCents),
                    fromCents(totalCents)
                 ]
            )

            const detalleInsertado = []

            for (const d of detalle) {
                const { rows: [fila] } = await client.query(
                    `INSERT INTO detalle_ventas
                        (company_id, sale_id, product_id, quantity, unit_price, subtotal)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *`,
                    [
                        currentUser.company_id,
                        venta.id,
                        d.product_id,
                        d.quantity,
                        fromCents(d.unitCents),
                        fromCents(d.subtotalCents),
                    ]
                )
                detalleInsertado.push(fila)
            }

            for (const d of detalle) {
                await client.query(
                    `UPDATE inventario
                        SET quantity = quantity - $1,
                            updated_at = now()
                    WHERE branch_id = $2
                        AND company_id = $3
                        AND product_id = $4`,
                    [d.quantity, currentUser.branch_id, currentUser.company_id, d.product_id]
                )
            }

            await client.query("COMMIT")

            return NextResponse.json(
                { venta, detalle: detalleInsertado },
                { status: 201 }
            )


        } catch(err) {
            await client.query("ROLLBACK")
            throw err
        } finally {
            client.release()
        }   
    } catch (err) {
        return NextResponse.json(
            { error: `Ha ocurrido un error en el backend ${err}` },
            { status: 500 }
        )
    }
}