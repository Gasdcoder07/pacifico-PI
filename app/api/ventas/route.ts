import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

interface ItemVenta {
    idProducto: number
    quantity: number
}

interface PayloadVentas {
    pay_method: number,
    productsIds: ItemVenta[]
}

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

            await client.query("COMMIT")

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