"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { ModalLayout } from "@/shared/components/ModalLayout";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
    const t = useTranslations("LogoutModal");
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        cancelButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleConfirm = () => {
        if (isConfirming) return;

        setIsConfirming(true);
        onConfirm();
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-modal-title"
                aria-describedby="logout-modal-message"
                className="flex flex-col gap-4 text-sm"
            >
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-brand-200 bg-brand-50">
                        <LogOut size={28} className="text-brand-600" aria-hidden="true" />
                    </div>

                    <h2 id="logout-modal-title" className="text-center text-xl font-semibold">
                        {t("title")}
                    </h2>
                </div>

                <div className="px-4 py-3">
                    <p id="logout-modal-message" className="text-center text-neutral-700">
                        {t("message")}
                    </p>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                    <motion.button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        disabled={isConfirming}
                        whileHover={isConfirming ? undefined : { y: -3, scale: 1.02 }}
                        whileTap={isConfirming ? undefined : { y: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="cursor-pointer rounded-lg border border-neutral-200 px-4 py-2 text-neutral-600 transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("cancel")}
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        whileHover={isConfirming ? undefined : { y: -3, scale: 1.02 }}
                        whileTap={isConfirming ? undefined : { y: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="cursor-pointer rounded-lg bg-cyan-400 px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("confirm")}
                    </motion.button>
                </div>
            </div>
        </ModalLayout>
    );
};
