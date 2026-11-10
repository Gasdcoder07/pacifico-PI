
/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener métricas del dashboard
 *     description: |
 *       Devuelve métricas de ventas del año indicado (por defecto, el año actual).
 *
 *       - **rol_id = 1**: métricas de todas las sucursales de su compañía.
 *         Incluye `sales_branches`.
 *       - **rol_id = 2**: métricas solo de su sucursal. No incluye `sales_branches`.
 *       - **Otros roles**: sin permiso (403).
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         description: Año en formato YYYY. Por defecto, el año actual.
 *         schema:
 *           type: string
 *           pattern: '^\d{4}$'
 *           example: "2026"
 *     responses:
 *       200:
 *         description: Métricas obtenidas correctamente
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Falta el token de sesión
 *       403:
 *         description: El rol del usuario no tiene permiso
 *       404:
 *         description: Token inválido o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

const TZ = "America/Mexico_City";
const TOP_PRODUCTS_LIMIT = 5;
const MONTHS = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
]

const currentYear = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric" }).format(
        new Date(),
    )
const round2 = (n: number) => Math.round(n*100) / 100

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "No se pudo encontrar el token de sesión" },
                { status: 401 }
            )
        }
        const token = authHeader.split(" ")[1];
 
        const {data: { user: authUser },error: authError} = await supabase.auth.getUser(token);
 
        if (!authUser || authError) {
            return NextResponse.json(
                { error: "Ha ocurrido un error al obtener el usuario de supabase" },
                { status: 404 },
            );
        }
    
        const currentUserQuery = await pool.query(
            `SELECT rol_id, company_id, branch_id FROM usuarios WHERE auth_user_id = $1;`,
            [authUser.id],
        );
 
        const currentUser = currentUserQuery.rows[0];
 
        if (!currentUser) {
            return NextResponse.json(
                { error: "No se pudo extraer el usuario de la base de datos" },
                { status: 404 },
            );
        }
 
        const rolId = Number(currentUser.rol_id);
 
        if(![1, 2].includes(rolId)) {
            return NextResponse.json(
                { error: "No tienes permiso para acceder a esto" },
                { status: 403 },
            );
        }
 
        const isAdmin = rolId === 1;
 
        if (!isAdmin && !currentUser.branch_id) {
            return NextResponse.json(
                { error: "El gerente no tiene una sucursal asignada" },
                { status: 403 },
            );
        }
 
        const { searchParams } = new URL(request.url);
        const year = searchParams.get("year") ?? currentYear();
 
        if (!/^\d{4}$/.test(year)) {
            return NextResponse.json(
                { error: "Formato de año inválido, usa YYYY" },
                { status: 400 },
           );
        }
 
        const params: (number | string)[] = [currentUser.company_id, `${year}-01-01`];
        const conditions = [
            "v.company_id = $1",
            `v.sale_date >= ($2::date::timestamp AT TIME ZONE '${TZ}')`,
            `v.sale_date < (($2::date + interval '1 year') AT TIME ZONE '${TZ}')`,
        ];
 
        if (!isAdmin) {
            params.push(currentUser.branch_id);
            conditions.push(`v.branch_id = $${params.length}`);
        }
 
        const where = conditions.join(" AND ");
 
        const [totalsRes, productsCountRes, monthlyRes, topProductsRes, branchesRes] =
        await Promise.all([
            pool.query(
                `SELECT COALESCE(SUM(v.total), 0) AS total_sales,
                  COUNT(*)                  AS transactions
                FROM ventas v
                WHERE ${where}`,
                params,
            ),
 
            pool.query(
                `SELECT COALESCE(SUM(dv.quantity), 0) AS saled_products
                FROM detalle_ventas dv
                JOIN ventas v ON v.id = dv.sale_id AND v.company_id = dv.company_id
                WHERE ${where}`,
                params,
            ),
 
            pool.query(
                `SELECT EXTRACT(MONTH FROM v.sale_date AT TIME ZONE '${TZ}')::int AS month,
                        SUM(v.total) AS sales
                FROM ventas v
                WHERE ${where}
                GROUP BY 1`,
                params,
            ),
 
            pool.query(
                `SELECT p.name AS product,
                        SUM(dv.subtotal) AS sales
                FROM detalle_ventas dv
                JOIN ventas v ON v.id = dv.sale_id AND v.company_id = dv.company_id
                JOIN productos p ON p.id = dv.product_id
                WHERE ${where}
                GROUP BY p.id, p.name
                ORDER BY sales DESC
                LIMIT ${TOP_PRODUCTS_LIMIT}`,
                params,
            ),
 
            isAdmin
                ? pool.query(
                    `SELECT s.name AS branch,
                            SUM(v.total) AS sales
                    FROM ventas v
                    JOIN sucursales s ON s.id = v.branch_id
                    WHERE ${where}
                    GROUP BY s.id, s.name
                    ORDER BY sales DESC`,
                    params,
                    )
                : Promise.resolve(null),
        ]);
 
        const totalSales = Number(totalsRes.rows[0].total_sales);
        const transactions = Number(totalsRes.rows[0].transactions);

        const raw_data = {
            total_sales: round2(totalSales),
            transactions,
            average_ticket: transactions > 0 ? round2(totalSales / transactions) : 0,
            saled_products: Number(productsCountRes.rows[0].saled_products),
        };

        const salesByMonth = new Map<number, number>(
            monthlyRes.rows.map((r) => [Number(r.month), Number(r.sales)]),
        );
        const sales_overview = MONTHS.map((name, i) => ({
            [name]: round2(salesByMonth.get(i + 1) ?? 0),
        }));

        const top_products = topProductsRes.rows.map((r) => ({
            [r.product]: round2(Number(r.sales)),
        }));

        if (!isAdmin) {
            return NextResponse.json({
                data: { raw_data, sales_overview, top_products },
            });
        }

        const sales_branches = branchesRes!.rows.map((r) => ({
            [r.branch]: round2(Number(r.sales)),
        }));

        return NextResponse.json({
            data: { raw_data, sales_overview, sales_branches, top_products },
        });
    } catch (err) {
        return NextResponse.json(
            { error: `Error interno del servidor ${err}` },
            { status: 500 },
        )
    }
}