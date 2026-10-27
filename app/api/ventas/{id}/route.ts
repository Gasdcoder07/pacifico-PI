import { pool } from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     description: Consulta la base de datos y devuelve los detalles de una venta específica usando su ID. Requiere autenticación mediante token JWT.
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la venta a consultar
 *         schema:
 *           type: integer
 *           example: 37
 *     responses:
 *       200:
 *         description: Datos de la venta recibidos con éxito.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       401:
 *         description: Sesión expirada o token inválido.
 *       404:
 *         description: No existe una venta con ese ID.
 *       500:
 *         description: Error interno en el servidor.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No autorizado. Falta el token de sesión" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const {
            data: { user: authUser },
            error: authError
        } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Sesión expirada o token inválido" },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const ventaId = parseInt(resolvedParams.id, 10);

        if (isNaN(ventaId)) {
            return NextResponse.json(
                { error: "Has ingresado un parámetro que no es un número" },
                { status: 400 }
            );
        }

        const response = await pool.query(
            `
            SELECT
                v.id,
                v,.company_id,
                v.branch_id,
                v.cashier_id,
                v.payment_method_id,
                v.sale_date,
                v.subtotal,
                v.tax_rate,
                v.tax_amount,
                v.total,
                v.created_at
            FROM ventas v
            WHERE v.id = $1;
            `,
            [ventaId]
        );

        const venta = response.rows[0];

        if (!venta) {
            return NextResponse.json(
                { error: "No existe una venta con ese ID" },
                { status: 404 }
            );
        }

        const detalleResponse = await pool.query(
            `
            SELECT
                dv.product_id,
                p.name AS producto,
                p.code,
                dv.quantity,
                dv.unit_price,
                dv.subtotal
            FROM detalle_ventas dv
            LEFT JOIN productos p ON p.id = dv.product_id
            WHERE dv.sale_id = $1
            ORDER BY dv.product_id;
            `,
            [ventaId]
        );

        return NextResponse.json(
            {
                message: "Datos de la venta recibidos con éxito",
                data: {
                    ...venta,
                    productos: detalleResponse.rows
                }
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("Error en GET /api/ventas/[id]:", err);

        return NextResponse.json(
            { error: "Error interno en el servidor" },
            { status: 500 }
        );
    }
}