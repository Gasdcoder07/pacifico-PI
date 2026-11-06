"use client";

import {
    Banknote,
    Box,
    CalendarDays,
    CreditCard,
    FileText,
    Landmark,
    Store,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { PaymentMethod } from "@/features/sales/types/payment-methods";

export type SalePaymentType = "cash" | "card" | "bank_transfer";

export interface Sale {
    id: number;
    company_id: number;
    branch_id: number;
    cashier_id: number;
    payment_method_id: PaymentMethod;
    sale_date: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    created_at: string;
    branch_name: string;
    cashier_name: string;
    payment_method: SalePaymentType;
}

interface SaleCardProps {
    sale: Sale;
    onViewTicket?: (saleId: number) => void;
}

const paymentDisplay: Record<
    SalePaymentType,
    { Icon: LucideIcon; styles: string }
> = {
    cash: {
        Icon: Banknote,
        styles: "border-emerald-100 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    },
    card: {
        Icon: CreditCard,
        styles: "border-sky-100 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-500 dark:text-sky-400",
    },
    bank_transfer: {
        Icon: Landmark,
        styles: "border-violet-100 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-400",
    },
};

export const SaleCard = ({ sale, onViewTicket }: SaleCardProps) => {
    const t = useTranslations("SalesPage.history");
    const format = useFormatter();
    const { Icon, styles } = paymentDisplay[sale.payment_method];
    const date = format.dateTime(new Date(sale.sale_date), {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    const taxRate = format.number(sale.tax_rate, {
        style: "percent",
        maximumFractionDigits: 0,
    });

    const formatCurrency = (amount: number) =>
        format.number(amount, { style: "currency", currency: "USD" });

    return (
        <article className="bg-white dark:bg-slate-900 flex gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 p-4 shadow-sm">
            <div className={`flex p-4 w-32 shrink-0 items-center justify-center rounded-lg border ${styles}`}>
                <Icon size={64} strokeWidth={1.5}/>
            </div>
            <div className="grid grid-cols-2 flex-1 min-w-auto gap-4">
                <div className="flex justify-between flex-col gap-4 border-r border-neutral-200 dark:border-slate-800">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <Box size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                        {t("sale", { id: sale.id })}
                    </span>

                    <div className="flex flex-col flex-1 min-w-0 gap-4 pr-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <CalendarDays
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />
                            <span className="min-w-0 truncate text-sm text-neutral-600 dark:text-slate-400 font-medium">
                                {date}
                            </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                            <Store
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />
                            <span className="min-w-0 truncate text-sm text-neutral-700 dark:text-slate-300 font-medium">
                                {sale.branch_name}
                            </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                            <UserRound
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />
                            <span className="min-w-0 truncate text-sm text-neutral-700 dark:text-slate-300 font-medium">
                                {sale.cashier_name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between flex-col gap-4">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => onViewTicket?.(sale.id)}
                            className="inline-flex self-end w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-red-100 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
                        >
                            <FileText size={16} className="shrink-0" />
                            {t("ticketPdf")}
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 gap-4">
                        <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="text-neutral-600 dark:text-slate-400 font-medium">
                                {t("subtotal")}
                            </span>
                            <span className="font-semibold tabular-nums text-neutral-900 dark:text-slate-50">
                                {formatCurrency(sale.subtotal)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-neutral-600 dark:text-slate-400 font-medium">
                                {t("vat", { rate: taxRate })}
                            </span>
                            <span className="font-semibold tabular-nums text-neutral-900 dark:text-slate-50">
                                {formatCurrency(sale.tax_amount)}
                            </span>
                        </div>

                        <div className="flex w-full text-sm items-center justify-between gap-3 rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-3.5 py-1.5">
                            <span className="font-semibold text-cyan-400">
                                {t("total")}
                            </span>
                            <span className="font-bold tabular-nums text-cyan-400">
                                {formatCurrency(sale.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
