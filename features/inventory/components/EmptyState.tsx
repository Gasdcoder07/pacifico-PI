"use client";

import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import AddProductButton from "./AddProductButton";

const EmptyState = () => {
    const t = useTranslations("InventoryPage.emptyState");

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm">
                <div className="rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
                    <PackageOpen size={28} />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-xl font-semibold tracking-wide">
                        {t("title")}
                    </h3>
                    <p className="max-w-md text-sm text-neutral-600 dark:text-slate-400">
                        {t("description")}
                    </p>
                </div>
                <AddProductButton/>
            </div>
        </div>
    );
};

export default EmptyState;