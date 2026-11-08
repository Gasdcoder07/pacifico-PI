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

const taxRate = Number(process.env.TAX_RATE ?? 0.16);

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener ventas y resumen de pagos
 *     description: Obtiene el historial paginado y el resumen de ventas por método de pago. El administrador puede consultar toda su empresa o una sucursal; gerente y cajero únicamente su sucursal.
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branch_id
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Resumen e historial de ventas.
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Sin permisos para consultar estas ventas.
 *       500:
 *         description: Error interno.
 */

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

export async function GET(request: Request) {
    try {
        // 1. Validar autenticación
        const authHeader = request.headers.get("Authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Token de autorización requerido" },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7).trim();

        const { data: { user }, error: authError } =
            await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Sesión inválida o expirada" },
                { status: 401 }
            );
        }

        // 2. Obtener usuario y permisos
        const userResult = await pool.query(
            `SELECT id, rol_id, branch_id, company_id
            FROM public.usuarios
            WHERE auth_user_id = $1
                AND status = true`,
            [user.id]
        );

        const usuario = userResult.rows[0];

        if (!usuario) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo" },
                { status: 404 }
            );
        }

        const rol = Number(usuario.rol_id);

        if (![1, 2, 3].includes(rol)) {
            return NextResponse.json(
                { error: "No tienes permisos para consultar ventas" },
                { status: 403 }
            );
        }

        // 3. Leer parámetros
        const searchParams = new URL(request.url).searchParams;

        const branchParam = searchParams.get("branch_id");
        const desde = searchParams.get("desde");
        const hasta = searchParams.get("hasta");

        const page = Number(searchParams.get("page") ?? 1);
        const limit = Number(searchParams.get("limit") ?? 20);

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return NextResponse.json(
                { error: "Página o límite inválido" },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;

        if (!Number.isSafeInteger(offset)) {
            return NextResponse.json(
                { error: "Parámetros de paginación inválidos" },
                { status: 400 }
            );
        }

        if (
            (desde && !isValidDate(desde)) ||
            (hasta && !isValidDate(hasta)) ||
            (desde && hasta && desde > hasta)
        ) {
            return NextResponse.json(
                { error: "Rango de fechas inválido" },
                { status: 400 }
            );
        }

        // 4. Aplicar restricciones de sucursal
        let branchId: number | null = null;

        if (rol === 1) {
            // Administrador: puede seleccionar cualquier sucursal
            // de su empresa o consultar todas.

            if (branchParam !== null) {
                const parsedBranch = Number(branchParam);

                if (
                    !Number.isSafeInteger(parsedBranch) ||
                    parsedBranch <= 0
                ) {
                    return NextResponse.json(
                        { error: "ID de sucursal inválido" },
                        { status: 400 }
                    );
                }

                const branchResult = await pool.query(
                    `SELECT id
                        FROM sucursales
                        WHERE id = $1 AND company_id = $2`,
                    [parsedBranch, usuario.company_id]
                );

                if (branchResult.rows.length === 0) {
                    return NextResponse.json(
                        { error: "Sucursal no encontrada" },
                        { status: 404 }
                    );
                }

                branchId = parsedBranch;
            }
        } else {
            // Gerente y cajero: únicamente su sucursal.

            const ownBranch = Number(usuario.branch_id);

            if (!Number.isSafeInteger(ownBranch) || ownBranch <= 0) {
                return NextResponse.json(
                    { error: "El usuario no tiene una sucursal asignada" },
                    { status: 403 }
                );
            }

            if (
                branchParam !== null &&
                Number(branchParam) !== ownBranch
            ) {
                return NextResponse.json(
                    { error: "No tienes acceso a esta sucursal" },
                    { status: 403 }
                );
            }

            branchId = ownBranch;
        }

        // 5. Construir filtros SQL seguros
        const values: (string | number)[] = [
            usuario.company_id
        ];

        const conditions = ["v.company_id = $1"];

        if (branchId !== null) {
            values.push(branchId);
            conditions.push(`v.branch_id = $${values.length}`);
        }

        if (desde) {
            values.push(desde);
            conditions.push(
                `v.sale_date >= $${values.length}::date`
            );
        }

        if (hasta) {
            values.push(hasta);
            conditions.push(
                `v.sale_date < ($${values.length}::date + INTERVAL '1 day')`
            );
        }

        const limitPosition = values.push(limit);
        const offsetPosition = values.push(offset);

        // 6. Una consulta SQL para obtener resumen e historial
        const query = `
            WITH ventas_filtradas AS (
                SELECT
                    v.id,
                    v.branch_id,
                    v.cashier_id,
                    v.payment_method_id,
                    v.sale_date,
                    v.created_at,
                    v.subtotal,
                    v.tax_rate,
                    v.tax_amount,
                    v.total,

                    s.name AS sucursal,

                    NULLIF(
                        TRIM(CONCAT_WS(' ', u.name, u.last_name)),
                        ''
                    ) AS cajero,

                    mp.name AS metodo_pago,

                    CASE
                        WHEN LOWER(COALESCE(mp.name, '')) LIKE '%efectivo%'
                                OR LOWER(COALESCE(mp.name, '')) LIKE '%cash%'
                            THEN 'efectivo'

                        WHEN LOWER(COALESCE(mp.name, '')) LIKE '%transfer%'
                                OR LOWER(COALESCE(mp.name, '')) LIKE '%spei%'
                            THEN 'transferencia'

                        WHEN LOWER(COALESCE(mp.name, '')) LIKE '%tarjeta%'
                                OR LOWER(COALESCE(mp.name, '')) LIKE '%card%'
                            THEN 'tarjeta'

                        ELSE 'otro'
                    END AS tipo_pago

                FROM ventas v

                LEFT JOIN sucursales s
                    ON s.id = v.branch_id
                    AND s.company_id = v.company_id

                LEFT JOIN public.usuarios u
                    ON u.id = v.cashier_id

                LEFT JOIN metodos_pago mp
                    ON mp.id = v.payment_method_id

                WHERE ${conditions.join(" AND ")}
            )

            SELECT

                jsonb_build_object(

                    'cantidad_ventas',
                    COUNT(*)::int,

                    'subtotal',
                    COALESCE(SUM(subtotal), 0),

                    'iva',
                    COALESCE(SUM(tax_amount), 0),

                    'total',
                    COALESCE(SUM(total), 0),

                    'por_metodo_pago',
                    jsonb_build_object(

                        'efectivo', jsonb_build_object(
                            'cantidad',
                            COUNT(*) FILTER (
                                WHERE tipo_pago = 'efectivo'
                            )::int,

                            'subtotal',
                            COALESCE(
                                SUM(subtotal) FILTER (
                                    WHERE tipo_pago = 'efectivo'
                                ), 0
                            ),

                            'iva',
                            COALESCE(
                                SUM(tax_amount) FILTER (
                                    WHERE tipo_pago = 'efectivo'
                                ), 0
                            ),

                            'total',
                            COALESCE(
                                SUM(total) FILTER (
                                    WHERE tipo_pago = 'efectivo'
                                ), 0
                            )
                        ),

                        'transferencia', jsonb_build_object(
                            'cantidad',
                            COUNT(*) FILTER (
                                WHERE tipo_pago = 'transferencia'
                            )::int,

                            'subtotal',
                            COALESCE(
                                SUM(subtotal) FILTER (
                                    WHERE tipo_pago = 'transferencia'
                                ), 0
                            ),

                            'iva',
                            COALESCE(
                                SUM(tax_amount) FILTER (
                                    WHERE tipo_pago = 'transferencia'
                                ), 0
                            ),

                            'total',
                            COALESCE(
                                SUM(total) FILTER (
                                    WHERE tipo_pago = 'transferencia'
                                ), 0
                            )
                        ),

                        'tarjeta', jsonb_build_object(
                            'cantidad',
                            COUNT(*) FILTER (
                                WHERE tipo_pago = 'tarjeta'
                            )::int,

                            'subtotal',
                            COALESCE(
                                SUM(subtotal) FILTER (
                                    WHERE tipo_pago = 'tarjeta'
                                ), 0
                            ),

                            'iva',
                            COALESCE(
                                SUM(tax_amount) FILTER (
                                    WHERE tipo_pago = 'tarjeta'
                                ), 0
                            ),

                            'total',
                            COALESCE(
                                SUM(total) FILTER (
                                    WHERE tipo_pago = 'tarjeta'
                                ), 0
                            )
                        ),

                        'otro', jsonb_build_object(
                            'cantidad',
                            COUNT(*) FILTER (
                                WHERE tipo_pago = 'otro'
                            )::int,

                            'total',
                            COALESCE(
                                SUM(total) FILTER (
                                    WHERE tipo_pago = 'otro'
                                ), 0
                            )
                        )
                    )
                ) AS resumen,

                COUNT(*)::int AS total_registros,

                COALESCE(
                    (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', p.id,
                                'branch_id', p.branch_id,
                                'sucursal', p.sucursal,
                                'cashier_id', p.cashier_id,
                                'cajero', p.cajero,
                                'payment_method_id', p.payment_method_id,
                                'metodo_pago', p.metodo_pago,
                                'tipo_pago', p.tipo_pago,
                                'sale_date', p.sale_date,
                                'created_at', p.created_at,
                                'subtotal', p.subtotal,
                                'tax_rate', p.tax_rate,
                                'tax_amount', p.tax_amount,
                                'total', p.total
                            )
                            ORDER BY p.sale_date DESC, p.id DESC
                        )
                        FROM (
                            SELECT *
                            FROM ventas_filtradas
                            ORDER BY sale_date DESC, id DESC
                            LIMIT $${limitPosition}
                            OFFSET $${offsetPosition}
                        ) p
                    ),
                    '[]'::jsonb
                ) AS ventas

            FROM ventas_filtradas;
        `;

        const { rows } = await pool.query(query, values);

        const totalRegistros = rows[0].total_registros;

        return NextResponse.json(
            {
                resumen: rows[0].resumen,
                ventas: rows[0].ventas,
                paginacion: {
                    pagina_actual: page,
                    por_pagina: limit,
                    total_registros: totalRegistros,
                    total_paginas: Math.ceil(totalRegistros / limit)
                }
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "private, no-store"
                }
            }
        );

    } catch (error) {
        console.error("Error en GET /api/ventas:", error);

        return NextResponse.json(
            { error: "Error interno al consultar las ventas" },
            { status: 500 }
        );
    }
}


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
            SELECT rol_id, branch_id, id, company_id
            FROM public.usuarios
            WHERE auth_user_id = $1
                AND status = true
        `, [authUser.id]);

        const currentUser = currentUserQuery.rows[0]

        if (!currentUser) {
            return NextResponse.json(
                { error: "No se pudo obtener el usuario de la base de datos" },
                { status: 404 }
            )
        }

        const { pay_method, productsIds } : PayloadVentas = await request.json()

        const branch = (await pool.query("SELECT id,company_id,admin_id,name,direction,phone,contact_info,status FROM sucursales WHERE id = $1 AND company_id = $2", [currentUser.branch_id, currentUser.company_id])).rows[0]
        const payMethod = (await pool.query("SELECT id,name,status FROM metodos_pago WHERE id = $1", [pay_method])).rows[0]

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

            // Obtener arreglos para insertar y actualizar por lotes
            const productIds = detalle.map(d => d.product_id);

            const quantities = detalle.map(d => d.quantity);

            const unitPrices = detalle.map(
                d => fromCents(d.unitCents)
            );

            const subtotals = detalle.map(
                d => fromCents(d.subtotalCents)
            );

            // Insertar todos los detalles de la venta en una consulta
            const { rows: detalleInsertado } = await client.query(
                `
                INSERT INTO detalle_ventas (
                    company_id,
                    sale_id,
                    product_id,
                    quantity,
                    unit_price,
                    subtotal
                )
                SELECT
                    $1,
                    $2,
                    x.product_id,
                    x.quantity,
                    x.unit_price,
                    x.subtotal
                FROM UNNEST(
                    $3::bigint[],
                    $4::integer[],
                    $5::numeric[],
                    $6::numeric[]
                ) AS x(
                    product_id,
                    quantity,
                    unit_price,
                    subtotal
                )
                RETURNING
                    id,
                    company_id,
                    sale_id,
                    product_id,
                    quantity,
                    unit_price,
                    subtotal
                `,
                [
                    currentUser.company_id,
                    venta.id,
                    productIds,
                    quantities,
                    unitPrices,
                    subtotals
                ]
            );

            // Descontar todos los productos del inventario en una consulta
            const stockUpdated = await client.query(
                `
                UPDATE inventario i
                SET
                    quantity = i.quantity - x.quantity,
                    updated_at = NOW()
                FROM UNNEST(
                    $1::bigint[],
                    $2::integer[]
                ) AS x(product_id, quantity)
                WHERE i.product_id = x.product_id
                    AND i.branch_id = $3
                    AND i.company_id = $4
                    AND i.quantity >= x.quantity
                `,
                [
                    productIds,
                    quantities,
                    currentUser.branch_id,
                    currentUser.company_id
                ]
            );

            if (stockUpdated.rowCount !== productIds.length) {
                throw new Error(
                    "No se pudo actualizar todo el inventario"
                );
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