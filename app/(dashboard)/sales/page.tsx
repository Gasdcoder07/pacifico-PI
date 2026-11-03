"use client";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { PaymentMethod } from "@/features/sales/types/payment-methods";
import { Sale, SaleCard } from "@/features/sales/components/SaleCard";

const mockSales: Sale[] = [
    {
        id: 1042,
        company_id: 1,
        branch_id: 1,
        cashier_id: 1,
        payment_method_id: PaymentMethod.Efectivo,
        payment_method: "cash",
        sale_date: "2025-01-24T10:24:00-06:00",
        subtotal: 1800,
        tax_rate: 0.16,
        tax_amount: 288,
        total: 2088,
        created_at: "2025-01-24T10:24:00-06:00",
        branch_name: "Centro",
        cashier_name: "Ana Torres",
    },
    {
        id: 1041,
        company_id: 1,
        branch_id: 2,
        cashier_id: 2,
        payment_method_id: PaymentMethod.Tarjeta,
        payment_method: "card",
        sale_date: "2025-01-24T09:18:00-06:00",
        subtotal: 799,
        tax_rate: 0.16,
        tax_amount: 127.84,
        total: 926.84,
        created_at: "2025-01-24T09:18:00-06:00",
        branch_name: "Norte",
        cashier_name: "Luis Méndez",
    },
    {
        id: 1040,
        company_id: 1,
        branch_id: 3,
        cashier_id: 3,
        payment_method_id: PaymentMethod.Transferencia,
        payment_method: "bank_transfer",
        sale_date: "2025-01-23T16:42:00-06:00",
        subtotal: 3500,
        tax_rate: 0.16,
        tax_amount: 560,
        total: 4060,
        created_at: "2025-01-23T16:42:00-06:00",
        branch_name: "Sur",
        cashier_name: "Carlos Ruiz",
    },
    {
        id: 1039,
        company_id: 1,
        branch_id: 1,
        cashier_id: 1,
        payment_method_id: PaymentMethod.Efectivo,
        payment_method: "cash",
        sale_date: "2025-01-23T12:06:00-06:00",
        subtotal: 399,
        tax_rate: 0.16,
        tax_amount: 63.84,
        total: 462.84,
        created_at: "2025-01-23T12:06:00-06:00",
        branch_name: "Centro",
        cashier_name: "Ana Torres",
    },
    {
        id: 1038,
        company_id: 1,
        branch_id: 4,
        cashier_id: 4,
        payment_method_id: PaymentMethod.Tarjeta,
        payment_method: "card",
        sale_date: "2025-01-22T14:35:00-06:00",
        subtotal: 1250,
        tax_rate: 0.16,
        tax_amount: 200,
        total: 1450,
        created_at: "2025-01-22T14:35:00-06:00",
        branch_name: "Las Brisas",
        cashier_name: "Valeria Díaz",
    },
    {
        id: 1037,
        company_id: 1,
        branch_id: 5,
        cashier_id: 5,
        payment_method_id: PaymentMethod.Transferencia,
        payment_method: "bank_transfer",
        sale_date: "2025-01-21T11:12:00-06:00",
        subtotal: 620,
        tax_rate: 0.16,
        tax_amount: 99.2,
        total: 719.2,
        created_at: "2025-01-21T11:12:00-06:00",
        branch_name: "Santiago",
        cashier_name: "Diego Ramos",
    },
];

export default function SalesPage() {
    const t = useTranslations("SalesPage");

    const handleViewTicket = (saleId: number) => {
        toast(t("history.pdfPending", { id: saleId }));
    };

    return (
        <section className="flex min-w-0 flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                {mockSales.map((sale) => (
                    <SaleCard
                        key={sale.id}
                        sale={sale}
                        onViewTicket={handleViewTicket}
                    />
                ))}
            </div>
        </section>
    );
}
