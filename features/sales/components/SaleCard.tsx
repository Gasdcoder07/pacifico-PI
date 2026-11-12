"use client";

import { Sale } from "@/features/sell/types/sale";
import {
    CalendarDays,
    CreditCard,
    Banknote,
    FileText,
    Box,
    Store,
    UserRound,
    ArrowLeftRight,
    LoaderCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { getSaleTicket } from "../services/sales.services";
import { useSaleTicket } from "../hooks/useSaleTicket";

interface SaleCardProps {
    sale: Sale;
}

export const SaleCard = ({ sale }: SaleCardProps) => {
    const t = useTranslations("SalesPage.history");
    const { viewTicket, isLoading } = useSaleTicket();

    const format = useFormatter();

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

    return (
        <article className="flex rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-4">
                {/* 1 */}
                <div className="flex min-w-0 flex-col gap-4 border-r border-neutral-200 dark:border-slate-800">
                    <div className="flex w-full min-w-0 items-start gap-4 pr-4">
                        <div className="flex flex-1 min-w-0">
                            <span className="inline-flex min-w-0 max-w-full whitespace-nowrap items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <Box size={16} className="shrink-0" />
                                <span className="block min-w-0 truncate flex-1">
                                    {t("sale", { id: sale.id })}
                                </span>
                            </span>
                        </div>

                        <div className="flex flex-1 min-w-0">
                            <PaymentMethodBadge payment_method={sale.payment_method_id} />
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-4 pr-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <CalendarDays
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />

                            <span className="block flex-1 min-w-0 truncate text-sm font-medium text-neutral-600 dark:text-slate-400">
                                {date}
                            </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                            <Store
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />

                            <span className="block flex-1 min-w-0 truncate text-sm font-medium text-neutral-700 dark:text-slate-300">
                                {sale.sucursal ?? "-"}
                            </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                            <UserRound
                                size={16}
                                className="shrink-0 text-neutral-500 dark:text-[#8493A8]"
                            />

                            <span className="block flex-1 min-w-0 truncate text-sm font-medium text-neutral-700 dark:text-slate-300">
                                {sale.cajero ?? "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2 */}
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex justify-end">
                        <motion.button
                            whileHover={!isLoading ? { scale: 1.02 } : undefined}
                            whileTap={!isLoading ? { scale: 0.95 } : undefined}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                            onClick={() => viewTicket(sale.id)}
                            disabled={isLoading}
                            type="button"
                            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 px-3.5 py-1.5 text-xs font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                                {
                                    isLoading ? (
                                        <LoaderCircle size={16} className="shrink-0 animate-spin transition-all duration-200 ease-in-out" />
                                    ) : (
                                        <FileText size={16} className="shrink-0" />
                                    )
                                }

                                {t("ticketPdf")}
                        </motion.button>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="font-medium text-neutral-600 dark:text-slate-400">
                                {t("subtotal")}
                            </span>

                            <span className="font-semibold tabular-nums text-neutral-900 dark:text-slate-50">
                                ${sale.subtotal}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-neutral-600 dark:text-slate-400">
                                {t("vat", { rate: taxRate })}
                            </span>

                            <span className="font-semibold tabular-nums text-neutral-900 dark:text-slate-50">
                                ${sale.tax_amount}
                            </span>
                        </div>

                        <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-1.5 text-sm dark:border-cyan-500/30 dark:bg-cyan-500/10">
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                                {t("total")}
                            </span>

                            <span className="font-bold tabular-nums text-cyan-600 dark:text-cyan-400">
                                ${sale.total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

interface PaymentMethodBadgeProps {
    payment_method: number;
}

const PaymentMethodBadge = ({ payment_method }: PaymentMethodBadgeProps) => {
    const t = useTranslations("SalesPage.paymentMethod");
    let label = "";
    let spanStyles = "";
    let Icon = Banknote;

    if (payment_method === 2) {
        label = t("cash");
        spanStyles =
            "border-emerald-100 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400";
    } else if (payment_method === 3) {
        label = t("card");
        Icon = CreditCard;

        spanStyles =
            "border-sky-100 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-500 dark:text-sky-400";
    } else {
        label = t("transfer");
        Icon = ArrowLeftRight;

        spanStyles =
            "border-violet-100 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-500 dark:text-violet-400";
    }

    return (
        <span className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${spanStyles}`}>
            <Icon size={16} className="shrink-0" />
            <span className="min-w-0 truncate block flex-1">
                {label}
            </span>
        </span>
    )
}