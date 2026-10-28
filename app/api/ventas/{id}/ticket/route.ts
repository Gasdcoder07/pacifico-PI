import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import pool from "@/shared/lib/db";
import { supabase } from "@/shared/lib/supabase";


/**
 * @swagger
 * /api/ventas/{id}/ticket:
 *   get:
 *     summary: Descargar ticket de venta en PDF
 *     description: Genera un archivo PDF con los datos de la venta, productos, sucursal, cajero, subtotal, IVA y total.
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
 *         description: Archivo PDF del ticket generado correctamente
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
    { params }: { params: Promise<{ id: string }> }
) {
    const client = await pool.connect();

    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
        return NextResponse.json(
            { error: "Token de autorización requerido" },
            { status: 401 }
        );
    }

    const { data: authData, error: authError } =
        await supabase.auth.getUser(token);

    if (authError || !authData.user) {
        return NextResponse.json(
            { error: "Token inválido o sesión expirada" },
            { status: 401 }
        );
    }

    const { id } = await params;

    if (!/^\d+$/.test(id)) {
        return NextResponse.json(
            { error: "ID de venta inválido" },
            { status: 400 }
        );
    }

    const userResult = await client.query(
        `SELECT id, rol_id, branch_id, company_id
            FROM public.usuarios
        WHERE auth_user_id = $1 AND status = true`,
        [authData.user.id]
    );

    if (userResult.rows.length === 0) {
        return NextResponse.json(
            { error: "Usuario no encontrado o inactivo" },
            { status: 403 }
        );
    }

    const usuario = userResult.rows[0];

    if (![1, 2, 3].includes(Number(usuario.rol_id))) {
        return NextResponse.json(
            { error: "No tienes permisos para consultar este ticket" },
            { status: 403 }
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
            v.company_id,
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
        [id, usuario.company_id]
    );

    if (ventaResult.rows.length === 0) {
        return NextResponse.json(
            { error: "Venta no encontrada" },
            { status: 404 }
        );
    }

    const venta = ventaResult.rows[0];

    if (
        Number(usuario.rol_id) !== 1 &&
        Number(usuario.branch_id) !== Number(venta.branch_id)
    ) {
        return NextResponse.json(
            { error: "No tienes permiso para consultar ventas de otra sucursal" },
            { status: 403 }
        );
    }

    const detalleResult = await client.query(
        `SELECT
            dv.product_id,
            p.code AS codigo,
            p.name AS producto,
            dv.quantity AS cantidad,
            dv.unit_price AS precio_unitario,
            dv.subtotal
        FROM detalle_ventas dv
        INNER JOIN productos p ON p.id = dv.product_id
        WHERE dv.sale_id = $1
            AND dv.company_id = $2
        ORDER BY dv.id`,
        [id, usuario.company_id]
    );

    const moneda = (valor: number | string) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(Number(valor));

    const fecha = new Date(venta.sale_date).toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short",
    });

    const doc = new PDFDocument({
        size: "A4",
        margins: { top: 45, bottom: 45, left: 45, right: 45 },
        bufferPages: true,
    });

    const chunks: Buffer[] = [];

    const pdfBuffer = new Promise<Buffer>((resolve, reject) => {
        doc.on("data", (chunk: Buffer) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
    });

    const ancho = doc.page.width - 90;

    doc.font("Helvetica-Bold").fontSize(20).text("TICKET DE VENTA", {
        align: "center",
    });

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(10);
    doc.text(`Venta: #${venta.id}`, { align: "center" });
    doc.text(`Fecha: ${fecha}`, { align: "center" });

    doc.moveDown();
    doc.moveTo(45, doc.y).lineTo(45 + ancho, doc.y).stroke();
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(12).text("Datos de la sucursal");
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(10);
    doc.text(`Sucursal: ${venta.sucursal ?? "No disponible"}`);
    doc.text(`Dirección: ${venta.direccion ?? "No disponible"}`);
    doc.text(`Teléfono: ${venta.telefono ?? "No disponible"}`);
    doc.text(`Cajero: ${venta.cajero ?? ""} ${venta.apellido_cajero ?? ""}`.trim());
    doc.text(`Método de pago: ${venta.metodo_pago ?? "No disponible"}`);

    doc.moveDown();
    doc.moveTo(45, doc.y).lineTo(45 + ancho, doc.y).stroke();
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(12).text("Productos");
    doc.moveDown(0.5);

    const colProducto = 45;
    const colCantidad = 300;
    const colPrecio = 365;
    const colSubtotal = 455;

    const encabezados = () => {
        doc.font("Helvetica-Bold").fontSize(9);
        doc.text("Producto", colProducto, doc.y, { width: 245 });
        const y = doc.y - 11;
        doc.text("Cant.", colCantidad, y, { width: 55, align: "right" });
        doc.text("Precio", colPrecio, y, { width: 75, align: "right" });
        doc.text("Importe", colSubtotal, y, { width: 100, align: "right" });
        doc.moveDown(0.8);
        doc.moveTo(45, doc.y).lineTo(45 + ancho, doc.y).stroke();
        doc.moveDown(0.4);
    };

    encabezados();

    for (const producto of detalleResult.rows) {
        const descripcion = String(producto.producto);
        doc.font("Helvetica").fontSize(9);
        const altura = Math.max(
            15,
            doc.heightOfString(descripcion, { width: 245 })
        );
        

        if (doc.y + altura + 20 > doc.page.height - 100) {
            doc.addPage();
            encabezados();
        }

        const y = doc.y;

        doc.font("Helvetica").fontSize(9);
        doc.text(descripcion, colProducto, y, { width: 245 });
        doc.text(String(producto.cantidad), colCantidad, y, {
            width: 55,
            align: "right",
        });
        doc.text(moneda(producto.precio_unitario), colPrecio, y, {
            width: 75,
            align: "right",
        });
        doc.text(moneda(producto.subtotal), colSubtotal, y, {
            width: 100,
            align: "right",
        });

        doc.y = y + altura + 5;
    }

    if (doc.y + 100 > doc.page.height - 45) {
        doc.addPage();
    }

    doc.moveDown();
    doc.moveTo(45, doc.y).lineTo(45 + ancho, doc.y).stroke();
    doc.moveDown();

    const escribirTotal = (etiqueta: string, valor: number | string, negrita = false) => {
        doc.font(negrita ? "Helvetica-Bold" : "Helvetica").fontSize(11);
        doc.text(etiqueta, 250, doc.y, { width: 140 });
        doc.text(moneda(valor), 390, doc.y - 12, {
            width: 115,
            align: "right",
        });
        doc.moveDown(0.5);
    };

    escribirTotal("Subtotal:", venta.subtotal);
    escribirTotal(
        `IVA (${Number(venta.tax_rate)}%):`,
        venta.tax_amount
    );
    escribirTotal("TOTAL:", venta.total, true);

    doc.moveDown(2);
    doc.font("Helvetica").fontSize(10);
    doc.text("¡Gracias por su compra!", { align: "center" });

    doc.end();

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
        { status: 500 }
    );
    } finally {
        client.release();
    }
}
