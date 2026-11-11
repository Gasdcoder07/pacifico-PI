"use client";

import { Tags } from "lucide-react";
import { useTranslations } from "next-intl";

import { getCategories } from "@/features/inventory/services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import EditCategoryForm from "./EditCategoryForm";

const Container = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const categories = data ?? [];

    if (isLoading) return <SpookyScarySkeleton />;

    return (
        <div
            className="flex min-w-0 flex-1 flex-col gap-4"
        >
            {categories.length === 0 ? (
                <EmptyState />
            ) : (
                categories.map((category) => (
                    <EditCategoryForm
                        key={category.id}
                        category={category}/>
                ))
            )}
        </div>
    );
};

export default Container;

const EmptyState = () => {
    const t = useTranslations("InventoryPage.categoriesPanel.emptyState");

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center shadow-sm">
            <div className="rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
                <Tags size={28} />
            </div>

            <div className="flex max-w-sm flex-col gap-2">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-50">
                    {t("title")}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-slate-400">
                    {t("description")}
                </p>
            </div>
        </div>
    );
};

const SpookyScarySkeleton = () => {
    return (
        <div className="min-h-0 min-w-0 flex flex-1 h-full w-full">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 dark:bg-slate-800 shadow-sm h-full w-full animate-pulse transition-all duration-200 ease-in-out" />
        </div>
    );
};
