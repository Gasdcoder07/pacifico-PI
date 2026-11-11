import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import type { PoolClient } from "pg";
import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";

/**
 * @swagger
 * /api/ventas/{id}/ticket:
 *   get:
 *     summary: Descargar ticket de venta en PDF
 *     description: Genera un PDF con la sucursal, el cajero, los productos y los importes de la venta.
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
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Ticket de venta generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID de venta inválido
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Usuario sin permisos para consultar la venta
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error interno al generar el PDF
 */

export const runtime = "nodejs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    let client: PoolClient | undefined;

    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;

        if (!token) {
            return NextResponse.json(
                { error: "Token de autorización requerido" },
                { status: 401 },
            );
        }

        const { data: authData, error: authError } =
            await supabase.auth.getUser(token);

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: "Token inválido o sesión expirada" },
                { status: 401 },
            );
        }

        const { id } = await params;

        if (!/^\d+$/.test(id)) {
            return NextResponse.json(
                { error: "ID de venta inválido" },
                { status: 400 },
            );
        }

        client = await pool.connect();

        const userResult = await client.query(
            `SELECT id, rol_id, branch_id, company_id
             FROM public.usuarios
             WHERE auth_user_id = $1 AND status = true`,
            [authData.user.id],
        );

        const usuario = userResult.rows[0];

        if (!usuario) {
            return NextResponse.json(
                { error: "Usuario no encontrado o inactivo" },
                { status: 403 },
            );
        }

        const rol = Number(usuario.rol_id);

        if (![1, 2, 3].includes(rol)) {
            return NextResponse.json(
                { error: "No tienes permisos para consultar este ticket" },
                { status: 403 },
            );
        }

        const ventaResult = await client.query(
            `SELECT
                v.id,
                v.sale_date,
                v.subtotal,
                v.tax_rate,
                v.tax_amount,
                v.total,
                v.branch_id,
                s.name AS sucursal,
                s.direction AS direccion,
                s.phone AS telefono,
                u.name AS cajero,
                u.last_name AS apellido_cajero,
                mp.name AS metodo_pago
             FROM ventas v
             LEFT JOIN sucursales s ON s.id = v.branch_id
             LEFT JOIN public.usuarios u ON u.id = v.cashier_id
             LEFT JOIN metodos_pago mp ON mp.id = v.payment_method_id
             WHERE v.id = $1 AND v.company_id = $2`,
            [id, usuario.company_id],
        );

        const venta = ventaResult.rows[0];

        if (!venta) {
            return NextResponse.json(
                { error: "Venta no encontrada" },
                { status: 404 },
            );
        }

        if (
            rol !== 1 &&
            Number(usuario.branch_id) !== Number(venta.branch_id)
        ) {
            return NextResponse.json(
                { error: "No tienes permiso para consultar ventas de otra sucursal" },
                { status: 403 },
            );
        }

        const detalleResult = await client.query(
            `SELECT
                p.name AS producto,
                dv.quantity AS cantidad,
                dv.unit_price AS precio_unitario,
                dv.subtotal
             FROM detalle_ventas dv
             INNER JOIN productos p ON p.id = dv.product_id
             WHERE dv.sale_id = $1 AND dv.company_id = $2
             ORDER BY dv.id`,
            [id, usuario.company_id],
        );

        client.release();
        client = undefined;

        // Aquí empieza el diseño del ticket.
        const colores = {
            azul: "#2C92B8",
            azulOscuro: "#196784",
            encabezado: "#E7F4F8",
            tabla: "#E3F2F7",
            fila: "#F4FAFC",
            total: "#D8EEF5",
            texto: "#142D3A",
            secundario: "#49636E",
        };

        const formatoMoneda = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        });

        const moneda = (valor: number | string) =>
            formatoMoneda.format(Number(valor));

        const fecha = new Date(venta.sale_date).toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "America/Mexico_City",
        });

        const cajero = [venta.cajero, venta.apellido_cajero]
            .filter(Boolean)
            .join(" ")
            .trim();

        const margen = 42;
        const doc = new PDFDocument({
            size: "A4",
            margin: margen,
            info: { Title: `Pacífico PI | Ticket de venta #${venta.id}` },
        });

        const chunks: Buffer[] = [];
        const pdfBuffer = new Promise<Buffer>((resolve, reject) => {
            doc.on("data", (chunk: Buffer) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        const ancho = doc.page.width - margen * 2;
        const limite = doc.page.height - margen;

        type EstiloTexto = {
            size?: number;
            bold?: boolean;
            color?: string;
            align?: "left" | "center" | "right";
        };

        function texto(
            valor: string,
            x: number,
            y: number,
            width: number,
            estilo: EstiloTexto = {},
        ) {
            doc.font(estilo.bold ? "Helvetica-Bold" : "Helvetica")
                .fontSize(estilo.size ?? 10)
                .fillColor(estilo.color ?? colores.texto)
                .text(valor, x, y, {
                    width,
                    align: estilo.align ?? "left",
                });

            return doc.y;
        }

        function fondo(
            x: number,
            y: number,
            width: number,
            height: number,
            color: string,
        ) {
            doc.roundedRect(x, y, width, height, 7).fill(color);
        }

        const columnas = [
            { titulo: "Producto", x: 54, ancho: 244, align: "left" },
            { titulo: "Cant.", x: 308, ancho: 45, align: "right" },
            { titulo: "Precio", x: 361, ancho: 84, align: "right" },
            { titulo: "Importe", x: 453, ancho: 88, align: "right" },
        ] as const;

        function encabezadoProductos(y: number) {
            texto("Productos", margen, y, ancho, { size: 13, bold: true });
            fondo(margen, y + 22, ancho, 30, colores.tabla);

            for (const columna of columnas) {
                texto(columna.titulo, columna.x, y + 32, columna.ancho, {
                    bold: true,
                    color: colores.azulOscuro,
                    align: columna.align,
                });
            }

            return y + 52;
        }

        fondo(margen, 40, ancho, 100, colores.encabezado);

        texto("Pacífico PI", 60, 58, 240, {
            size: 12,
            bold: true,
            color: colores.azulOscuro,
        });
        texto("Ticket de venta", 60, 82, 280, { size: 27, bold: true });

        texto(`Venta #${venta.id}`, 350, 68, 185, {
            size: 15,
            bold: true,
            color: colores.azulOscuro,
            align: "right",
        });
        texto(fecha, 350, 94, 185, {
            color: colores.secundario,
            align: "right",
        });

        texto("Datos de la sucursal", margen, 162, ancho, {
            size: 13,
            bold: true,
        });

        let y = texto(
            `Sucursal: ${venta.sucursal ?? "No disponible"}`,
            margen, 186, ancho, { size: 11, bold: true },
        ) + 7;

        y = texto(
            `Dirección: ${venta.direccion ?? "No disponible"}`,
            margen, y, ancho, { color: colores.secundario },
        ) + 10;

        const finTelefono = texto(
            `Teléfono: ${venta.telefono ?? "No disponible"}`,
            margen, y, 155,
        );
        const finCajero = texto(
            `Cajero: ${cajero || "No disponible"}`,
            211, y, 150,
        );
        const finPago = texto(
            `Método de pago: ${venta.metodo_pago ?? "No disponible"}`,
            375, y, 178, { align: "right" },
        );

        y = encabezadoProductos(Math.max(finTelefono, finCajero, finPago) + 24);

        for (const [indice, producto] of detalleResult.rows.entries()) {
            const valores = [
                String(producto.producto),
                String(producto.cantidad),
                moneda(producto.precio_unitario),
                moneda(producto.subtotal),
            ];

            const alturaFila = Math.max(
                36,
                ...columnas.map((columna, posicion) =>
                    doc.font(posicion === 3 ? "Helvetica-Bold" : "Helvetica")
                        .fontSize(10)
                        .heightOfString(valores[posicion], {
                            width: columna.ancho,
                        }) + 20,
                ),
            );

            if (y + alturaFila > limite) {
                doc.addPage();
                y = encabezadoProductos(margen);
            }

            if (indice % 2 === 1) {
                fondo(margen, y, ancho, alturaFila, colores.fila);
            }

            for (const [posicion, columna] of columnas.entries()) {
                texto(valores[posicion], columna.x, y + 10, columna.ancho, {
                    align: columna.align,
                    bold: posicion === 3,
                });
            }

            y += alturaFila;
        }

        if (y + 150 > limite) {
            doc.addPage();
            y = margen;
        }

        const iva = new Intl.NumberFormat("es-MX", {
            style: "percent",
            maximumFractionDigits: 2,
        }).format(Number(venta.tax_rate));

        doc.rect(margen, y, ancho, 1).fill(colores.azul);

        texto("Subtotal", 323, y + 18, 90);
        texto(moneda(venta.subtotal), 420, y + 18, 121, { align: "right" });

        texto(`IVA (${iva})`, 323, y + 40, 90);
        texto(moneda(venta.tax_amount), 420, y + 40, 121, { align: "right" });

        fondo(309, y + 60, 244, 42, colores.total);
        texto("Total", 323, y + 75, 85, {
            size: 12,
            bold: true,
            color: colores.azulOscuro,
        });
        texto(moneda(venta.total), 408, y + 72, 133, {
            size: 17,
            bold: true,
            align: "right",
        });

        texto("¡Gracias por su compra!", margen, y + 127, ancho, {
            size: 11,
            color: colores.secundario,
            align: "center",
        });

        doc.end();
        // Aquí termina el diseño del ticket.

        const buffer = await pdfBuffer;

        return new Response(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="ticket-venta-${venta.id}.pdf"`,
                "Content-Length": String(buffer.length),
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error al generar ticket PDF:", error);

        return NextResponse.json(
            { error: "Error interno al generar el ticket PDF" },
            { status: 500 },
        );
    } finally {
        client?.release();
    }
}