"use client";

import { Check, X, LoaderCircle } from "lucide-react";

export const toastContainerStyle: React.CSSProperties = {
    top: 80,
    right: 40,
};

const ToastDefaultStyles =
    "!bg-white !border !border-neutral-200 dark:!bg-slate-900 dark:!border-slate-800 !shadow-sm !rounded-lg !font-medium !tracking-wide";

export const toastOptionsConfig = {
    className: ToastDefaultStyles,
    duration: 4000,

    success: {
    className: `${ToastDefaultStyles} !text-green-600 dark:!text-emerald-400`,
    icon: <Check className="text-2xl text-green-600 dark:text-emerald-400" />,
    },

    error: {
        className: `${ToastDefaultStyles} !text-red-600 dark:!text-red-400`,
        icon: <X className="text-2xl text-red-600 dark:text-red-400" />,
    },

    loading: {
        className: `${ToastDefaultStyles} !text-orange-600 dark:!text-amber-400`,
        icon: (
            <LoaderCircle className="text-2xl text-orange-600 dark:text-amber-400 animate-spin transition-all duration-200 ease-in-out" />
        ),
    }
}