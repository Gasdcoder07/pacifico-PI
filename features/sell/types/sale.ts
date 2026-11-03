import { PaymentMethod } from "@/features/sales/types/payment-methods";

export interface SalePayload {
    pay_method: PaymentMethod;
    productsIds: {
        idProducto: number;
        quantity: number;
    }[];
}