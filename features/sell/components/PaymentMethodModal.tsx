"use client";

import { useState } from "react";
import { ArrowLeftRight, Banknote, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

import { ModalLayout } from "@/shared/components/ModalLayout";
import { PaymentMethod } from "@/app/sales/types/payment-methods";

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: PaymentMethod) => void;
}

const paymentOptions = [
    { method: PaymentMethod.Efectivo, label: "Cash", Icon: Banknote },
    { method: PaymentMethod.Tarjeta, label: "Card", Icon: CreditCard },
    {
        method: PaymentMethod.Transferencia,
        label: "Bank Transfer",
        Icon: ArrowLeftRight,
    },
];

export const PaymentMethodModal = ({
    isOpen,
    onClose,
    onConfirm
}: PaymentMethodModalProps) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

    const handleCompletePurchase = () => {
        if (selectedPaymentMethod === undefined) return;

        onConfirm(selectedPaymentMethod);
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Select payment method"
            width="max-w-lg"
        >
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                    {paymentOptions.map(({ method, label, Icon }) => {
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
                                        : "border-neutral-200 bg-white hover:border-brand-200 hover:bg-neutral-50"
                                }`}
                            >
                                <span className="rounded-full border border-brand-200 bg-brand-50 p-2 text-brand-600">
                                    <Icon size={22} />
                                </span>
                                <span className="text-sm font-medium text-neutral-700">
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-neutral-200 px-4 py-2 text-neutral-600 transition-colors duration-200 ease-in-out hover:bg-neutral-50"
                    >
                        Cancel
                    </button>
                    <motion.button
                        type="button"
                        whileHover={selectedPaymentMethod === undefined ? { } : { scale: 1.02 }}
                        whileTap={selectedPaymentMethod === undefined ? { } : { scale: 0.98 }}
                        onClick={handleCompletePurchase}
                        disabled={selectedPaymentMethod === undefined}
                        className="rounded-lg bg-cyan-400 px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-neutral-400 cursor-pointer"
                    >
                        Complete Purchase
                    </motion.button>
                </div>
            </div>
        </ModalLayout>
    );
};
