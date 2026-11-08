
import { pool } from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener una venta completa por ID
 *     description: Obtiene los datos generales, cajero, sucursal, método de pago e información de los productos.
 *     tags:
 *       - Ventas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Venta encontrada.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token inválido.
 *       403:
 *         description: Sin permisos para consultar la venta.
 *       404:
 *         description: Venta no encontrada.
 *       500:
 *         description: Error interno.
 */

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Autenticación
        const authHeader = request.headers.get("Authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Token de autorización requerido" },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7).trim();

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Sesión inválida o expirada" },
                { status: 401 }
            );
        }

        // 2. Validar ID
        const { id } = await params;

        if (!/^[1-9]\d*$/.test(id)) {
            return NextResponse.json(
                { error: "ID de venta inválido" },
                { status: 400 }
            );
        }

        // 3. Obtener usuario y permisos
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
                { status: 403 }
            );
        }

        const rol = Number(usuario.rol_id);

        if (![1, 2, 3].includes(rol)) {
            return NextResponse.json(
                { error: "No tienes permisos para consultar ventas" },
                { status: 403 }
            );
        }

        let branchScope: number | null = null;

        if (rol !== 1) {
            branchScope = Number(usuario.branch_id);

            if (
                !Number.isSafeInteger(branchScope) ||
                branchScope <= 0
            ) {
                return NextResponse.json(
                    { error: "El usuario no tiene una sucursal asignada" },
                    { status: 403 }
                );
            }
        }

        // 4. Obtener venta y productos en una sola consulta
        const result = await pool.query(
            `
            SELECT
                v.id,
                v.company_id,
                v.branch_id,

                s.name AS sucursal,

                v.cashier_id,

                NULLIF(
                    TRIM(CONCAT_WS(' ', u.name, u.last_name)),
                    ''
                ) AS cajero,

                v.payment_method_id,
                mp.name AS metodo_pago,

                v.sale_date,
                v.created_at,

                v.subtotal,
                v.tax_rate,
                v.tax_amount,
                v.total,

                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'product_id', dv.product_id,
                            'producto', p.name,
                            'codigo', p.code,
                            'quantity', dv.quantity,
                            'unit_price', dv.unit_price,
                            'subtotal', dv.subtotal
                        )
                        ORDER BY dv.id
                    ) FILTER (WHERE dv.id IS NOT NULL),
                    '[]'::jsonb
                ) AS productos

            FROM ventas v

            LEFT JOIN sucursales s
                ON s.id = v.branch_id
                AND s.company_id = v.company_id

            LEFT JOIN public.usuarios u
                ON u.id = v.cashier_id

            LEFT JOIN metodos_pago mp
                ON mp.id = v.payment_method_id

            LEFT JOIN detalle_ventas dv
                ON dv.sale_id = v.id
                AND dv.company_id = v.company_id

            LEFT JOIN productos p
                ON p.id = dv.product_id
                AND p.company_id = v.company_id

            WHERE v.id = $1
                AND v.company_id = $2
                AND ($3::bigint IS NULL OR v.branch_id = $3)

            GROUP BY
                v.id,
                v.company_id,
                v.branch_id,
                v.cashier_id,
                v.payment_method_id,
                v.sale_date,
                v.created_at,
                v.subtotal,
                v.tax_rate,
                v.tax_amount,
                v.total,
                s.name,
                u.name,
                u.last_name,
                mp.name
            `,
            [id, usuario.company_id, branchScope]
        );

        const venta = result.rows[0];

        if (!venta) {
            return NextResponse.json(
                { error: "Venta no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Venta obtenida correctamente",
                data: {
                    ...venta,
                    ticket_url: `/api/ventas/${venta.id}/ticket`
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
        console.error("Error en GET /api/ventas/[id]:", error);

        return NextResponse.json(
            { error: "Error interno al consultar la venta" },
            { status: 500 }
        );
    }
}
