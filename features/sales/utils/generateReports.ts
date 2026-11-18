import * as XSLX from "xlsx"

interface reportSaleData {
    raw_data: {
        total_sales: number;
        transactions: number;
        average_ticket: number;
        saled_products: number;
    };
    sales_overview: Record<string, number>[];
    sales_branches: Record<string, number>[];
    top_products: Record<string, number>[];
}

export function exportSalesToExcel(data: reportSaleData, fileName = 'reporte_ventas.xlsx') {
    const workbook = XSLX.utils.book_new()

    const resumenFormateado = [
        { Metrica: "Ventas totales", Valor: data.raw_data.total_sales },
        { Metrica: "Transacciones", Valor: data.raw_data.transactions },
        { Metrica: "Ticket promedio", Valor: data.raw_data.average_ticket },
        { Metrica: "Productos vendidos", Valor: data.raw_data.saled_products }
    ]
    const wsResumen = XSLX.utils.json_to_sheet(resumenFormateado)
    wsResumen['!cols'] = [{ wch: 22 }, { wch: 15 }]
    XSLX.utils.book_append_sheet(workbook, wsResumen, 'Resumen General')

    const mesesFormateados = data.sales_overview.map((item) => {
        const [mes, total] = Object.entries(item)[0]
        return { Mes: mes, 'Ventas ($)': total }
    })
    const wsMeses = XSLX.utils.json_to_sheet(mesesFormateados)
    wsMeses['!cols'] = [{ wch: 12 }, { wch: 15 }]
    XSLX.utils.book_append_sheet(workbook, wsMeses, "Ventas Mensuales")

    const sucursalesFormateadas = data.sales_branches.map((item) => {
        const [sucursal, total] = Object.entries(item)[0]
        return { Sucursal: sucursal, 'Ventas ($)': total }
    })
    const wsSucursales = XSLX.utils.json_to_sheet(sucursalesFormateadas)
    wsSucursales['!cols'] = [{ wch: 25 }, { wch: 15 }]
    XSLX.utils.book_append_sheet(workbook, wsSucursales, 'Sucursales')

    const productosFormateados = data.top_products.map((item, index) => {
        const [producto, total] = Object.entries(item)[0]
        return {
            Posicion: index+1,
            Product: producto,
            'Ingresos ($)': total
        }
    })
    const wsProductos = XSLX.utils.json_to_sheet(productosFormateados)
    wsProductos['!cols'] = [{ wch: 10 }, { wch: 60 }, { wch:15 }]
    XSLX.utils.book_append_sheet(workbook, wsProductos, 'Top Productos')

    XSLX.writeFile(workbook, fileName)
}