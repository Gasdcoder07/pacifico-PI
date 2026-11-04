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
    isPending
}: PaymentMethodModalProps) => {
    const t = useTranslations("SellPage.paymentMethodModal")

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

    const handleCompletePurchase = () => {
        if (selectedPaymentMethod === undefined) return;

        onConfirm(selectedPaymentMethod);
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
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
                        whileHover={selectedPaymentMethod === undefined ? { } : { scale: 1.02 }}
                        whileTap={selectedPaymentMethod === undefined ? { } : { scale: 0.98 }}
                        onClick={handleCompletePurchase}
                        disabled={selectedPaymentMethod === undefined || isPending}
                        className="rounded-lg bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-neutral-400 dark:disabled:bg-slate-700 cursor-pointer"
                    >
                        { isPending ? t("buttons.submitting") : t("buttons.confirm") }
                    </motion.button>
                </div>
            </div>
        </ModalLayout>
    );
};
