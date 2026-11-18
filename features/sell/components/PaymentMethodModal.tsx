"use client";

import { useState } from "react";
import { ArrowLeftRight, Banknote, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

import { useTranslations } from "next-intl";
import { ModalLayout } from "@/shared/components/ModalLayout";
import { PaymentMethod } from "@/features/sales/types/payment-methods";

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: PaymentMethod) => void;
    isPending: boolean;
    total: number;
}

const paymentOptions = [
    { method: PaymentMethod.Efectivo, key: "cash", Icon: Banknote },
    { method: PaymentMethod.Tarjeta, key: "card", Icon: CreditCard },
    {
        method: PaymentMethod.Transferencia,
        key: "transfer",
        Icon: ArrowLeftRight,
    },
];

export const PaymentMethodModal = ({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    total
}: PaymentMethodModalProps) => {
    const t = useTranslations("SellPage.paymentMethodModal");

    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentMethod>();

    const [cashReceived, setCashReceived] = useState("");

    const isCash = selectedPaymentMethod === PaymentMethod.Efectivo;
    const totalCents = Math.round(total * 100);

    const normalizedCash = cashReceived.replace(",", ".");
    const receivedAmount = Number(normalizedCash);

    const receivedCents =
        cashReceived.trim() !== "" &&
        Number.isFinite(receivedAmount)
            ? Math.round(receivedAmount * 100)
            : null;

    const changeCents = receivedCents === null
        ? 0
        : Math.max(0, receivedCents - totalCents);

    const canConfirm =
        !isPending &&
        selectedPaymentMethod !== undefined &&
        (
            !isCash ||
            (receivedCents !== null && receivedCents >= totalCents)
        );

    const formatMoney = (cents: number) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(cents / 100);

    const handleCashChange = (value: string) => {
        if (/^\d*(?:[.,]\d{0,2})?$/.test(value)) {
            setCashReceived(value);
        }
    };

    const handleCompletePurchase = () => {
        if (!canConfirm || selectedPaymentMethod === undefined) return;

        onConfirm(selectedPaymentMethod);
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={() => {
                if (!isPending) onClose();
            }}
            title={t("title")}
            width="max-w-lg"
        >
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                    {paymentOptions.map(({ method, key, Icon }) => {
                        const isSelected = selectedPaymentMethod === method;

                        return (
                            <button
                                key={method}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setSelectedPaymentMethod(method)}
                                className={`flex min-w-0 flex-col items-center justify-center gap-4 rounded-lg border px-10 py-8 text-center transition-colors duration-200 ease-in-out cursor-pointer ${
                                    isSelected
                                        ? "border-brand-300 bg-brand-50/50"
                                        : "border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-200 hover:bg-neutral-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span className="rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-2 text-brand-600 dark:text-cyan-400">
                                    <Icon size={22} />
                                </span>

                                <span className="text-sm font-medium text-neutral-700 dark:text-slate-300">
                                    {t(`methods.${key}`)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {isCash && (
                    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                        {/* Total */}
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-neutral-700 dark:text-slate-400">
                                {t("cash.total")}
                            </span>

                            <span className="text-lg font-bold tabular-nums text-neutral-900 dark:text-slate-50">
                                {formatMoney(totalCents)}
                            </span>
                        </div>

                        {/* Dinero recibido */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="cash-received"
                                className="text-sm font-medium text-neutral-700 dark:text-slate-300"
                            >
                                {t("cash.received")}
                            </label>

                            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 transition-colors focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-cyan-500">
                                <span className="text-lg font-semibold text-neutral-400 dark:text-slate-500">
                                    $
                                </span>

                                <input
                                    id="cash-received"
                                    type="text"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    value={cashReceived}
                                    onChange={(e) =>
                                        handleCashChange(e.target.value)
                                    }
                                    disabled={isPending}
                                    placeholder="0.00"
                                    className="w-full min-w-0 bg-transparent py-3 text-lg font-semibold tabular-nums text-neutral-900 outline-none placeholder:text-neutral-300 disabled:opacity-50 dark:text-slate-50 dark:placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 dark:border-slate-700" />

                        {/* Cambio */}
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-neutral-700 dark:text-slate-400">
                                {t("cash.change")}
                            </span>

                            <span className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                {receivedCents === null
                                    ? "—"
                                    : formatMoney(changeCents)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        disabled={isPending}
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-neutral-200 dark:border-slate-800 px-4 py-2 text-neutral-600 dark:text-slate-400 transition-colors duration-200 ease-in-out hover:bg-neutral-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent"
                    >
                        {t("buttons.cancel")}
                    </button>

                    <motion.button
                        type="button"
                        whileHover={canConfirm ? { scale: 1.02 } : {}}
                        whileTap={canConfirm ? { scale: 0.98 } : {}}
                        onClick={handleCompletePurchase}
                        disabled={!canConfirm}
                        className="rounded-lg bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-neutral-400 dark:disabled:bg-slate-700 cursor-pointer"
                    >
                        {isPending
                            ? t("buttons.submitting")
                            : t("buttons.confirm")}
                    </motion.button>
                </div>
            </div>
        </ModalLayout>
    );
};
