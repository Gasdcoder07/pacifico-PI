import { pool } from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/saldos:
 *   get:
 *     summary: Obtener saldos de ventas por sucursal
 *     description: |
 *       Devuelve número de ventas, subtotal, impuestos y total agrupados por sucursal.
 *
 *       - **rol_id = 1**: ve todas las sucursales de su compañía. Puede filtrar con `branch_id`.
 *       - **rol_id = 2**: ve solo su sucursal (`branch_id` se ignora).
 *       - **Otros roles**: sin permiso (403).
 *
 *       Si no se envía `mes`, se usa el mes actual.
 *     tags:
 *       - Saldos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mes
 *         required: false
 *         description: Mes en formato YYYY-MM. Por defecto, el mes actual.
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-(0[1-9]|1[0-2])$'
 *           example: "2026-10"
 *       - in: query
 *         name: branch_id
 *         required: false
 *         description: Filtra por una sucursal de la compañía. Solo aplica a rol_id = 1.
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Saldos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SaldoSucursal'
 *       400:
 *         description: Parámetros inválidos (mes o branch_id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Falta el token de sesión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El rol del usuario no tiene permiso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Token inválido o usuario no encontrado en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     SaldoSucursal:
 *       type: object
 *       properties:
 *         branch_id:
 *           type: string
 *           example: "12"
 *         sucursal:
 *           type: string
 *           example: Sucursal Centro
 *         num_ventas:
 *           type: string
 *           example: "148"
 *         subtotal:
 *           type: string
 *           example: "1250000.00"
 *         impuestos:
 *           type: string
 *           example: "237500.00"
 *         total:
 *           type: string
 *           example: "1487500.00"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */
export async function GET(request: Request) {
  try {
    const authHeader = await request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No se pudo encontrar el token de sesión" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (!authUser || authError) {
      return NextResponse.json(
        { error: "Ha ocurrido un error al obtener el usuario de supaabse" },
        { status: 404 },
      );
    }

    const currentUserQuery = await pool.query(`
      SELECT rol_id, company_id, branch_id FROM usuarios WHERE auth_user_id = $1;
    `, [authUser.id])

    const currentUser = currentUserQuery.rows[0]

    if (!currentUser) {
      return NextResponse.json(
        { error: "No se pudo extraer el usuario de la base de datos" },
        { status: 404 }
      )
    }

    if (![1,2].includes(Number(currentUser.rol_id))) {
      return NextResponse.json(
        { error: "No tienes permiso para acceder a esto" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes")

    if (mes && !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
      return NextResponse.json(
        { error: "Formato de mes inválido, usa YYYY-MM" },
        { status: 400 }
      )
    }

    const params: (number | string)[] = [currentUser.company_id]
    const conditions = ["v.company_id = $1"]

    if (mes) {
      params.push(`${mes}-01`);
      conditions.push(
        `v.sale_date >= $${params.length}::date`,
        `v.sale_date < $${params.length}::date + interval '1 month'`
      )
    } else {
      conditions.push(
        `v.sale_date >= date_trunc('month', now())`,
        `v.sale_date < date_trunc('month', now()) + interval '1 month'`
      )
    }

    if (currentUser.rol_id === 2) {
      params.push(currentUser.branch_id)
      conditions.push(`v.branch_id = $${params.length}`)
    } else {
      const branchParam = searchParams.get("branch_id");
      if (branchParam) {
        const branchId = Number(branchParam);
        if (!Number.isInteger(branchId)) {
          return NextResponse.json(
            { error: "branch_id inválido" },
            { status: 400 },
          );
        }
        params.push(branchId);
        conditions.push(`v.branch_id = $${params.length}`);
      }
    }

    const { rows } = await pool.query(
      `SELECT v.branch_id,
              s.name                AS sucursal,
              COUNT(*)              AS num_ventas,
              SUM(v.subtotal)       AS subtotal,
              SUM(v.tax_amount)     AS impuestos,
              SUM(v.total)          AS total
       FROM ventas v
       JOIN sucursales s ON s.id = v.branch_id
       WHERE ${conditions.join(" AND ")}
       GROUP BY v.branch_id, s.name
       ORDER BY v.branch_id`,
      params,
    );

    return NextResponse.json({ data: rows })

  } catch (err) {
    return NextResponse.json(
      { error: `Error interno del servidor ${err}` },
      { status: 500 }
    )
  }
}
