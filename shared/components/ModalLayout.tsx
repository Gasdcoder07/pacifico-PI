"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
    breathingBorder?: boolean;
}

export const ModalLayout = ({ isOpen, onClose, title, children, width = "max-w-lg", breathingBorder = false }: ModalLayoutProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`relative z-10 w-full bg-white rounded-lg shadow-sm border border-neutral-200 ${width} p-6 flex flex-col gap-6`}
                    >
                        {
                            title && (
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-neutral-700 tracking-wide">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-200 ease-in-out cursor-pointer"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            )
                        }

                        <div>{children}</div>

                        {breathingBorder && (
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-lg border-[1.5px]"
                                initial={{
                                    borderColor: "#22D3EE",
                                    boxShadow: "0 0 5px rgba(34, 211, 238, 0.18), 0 0 10px rgba(14, 165, 233, 0.08)",
                                }}
                                animate={{
                                    borderColor: ["#22D3EE", "#38BDF8", "#67E8F9", "#22D3EE"],
                                    boxShadow: [
                                        "0 0 5px rgba(34, 211, 238, 0.16), 0 0 10px rgba(14, 165, 233, 0.07)",
                                        "0 0 7px rgba(56, 189, 248, 0.22), 0 0 12px rgba(14, 165, 233, 0.10)",
                                        "0 0 5px rgba(103, 232, 249, 0.17), 0 0 10px rgba(34, 211, 238, 0.08)",
                                        "0 0 5px rgba(34, 211, 238, 0.16), 0 0 10px rgba(14, 165, 233, 0.07)",
                                    ],
                                }}
                                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};