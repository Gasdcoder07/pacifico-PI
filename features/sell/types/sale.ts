import { PaymentMethod } from "@/features/sales/types/payment-methods";

export interface SalesResponse {
    paginacion: SalesPagination;
    ventas: Sale[];
}

export interface Sale {
    id: number;
    branch_id: number;
    sucursal: string;

    cashier_id: number;
    cajero: string | null;

    payment_method_id: number;

    sale_date: string;

    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
}

export interface SalesPagination {
    pagina_actual: number;
    por_pagina: number;
    total_registros: number;
    total_paginas: number;
}

export interface SalePayload {
    pay_method: PaymentMethod;
    productsIds: {
        idProducto: number;
        quantity: number;
    }[];
}