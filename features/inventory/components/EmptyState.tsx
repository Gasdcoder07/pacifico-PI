"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import AddProductButton from "./AddProductButton";
import { getBranches } from "@/features/branches/services/branch.service";
import { getCategories } from "../services/inventory.service";
import CategoryButton from "@/features/categories/components/CategoriesButton";

interface EmptyStateProps {
    isAdmin: boolean;
}

const EmptyState = ({ isAdmin }: EmptyStateProps) => {
    const t = useTranslations("InventoryPage.emptyState");
    const router = useRouter();

    const handleManageBranches = () => {
        router.push("/branches");
    };

    const branchesQuery = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
        enabled: isAdmin,
        staleTime: 5 * 60 * 1000,
    });

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        enabled: isAdmin,
        staleTime: 5 * 60 * 1000,
    });

    const isLoading =
        isAdmin && (branchesQuery.isPending || categoriesQuery.isPending);

    const hasBranches = (branchesQuery.data?.length ?? 0) > 0;
    const hasCategories = (categoriesQuery.data?.length ?? 0) > 0;

    const canCreateProduct = isAdmin && hasBranches && hasCategories;

    return (
        <div className="flex h-full min-h-0 flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <PackageOpen size={28} />
                </div>

                <div className="mb-2 flex flex-col gap-2">
                    <h3 className="text-xl font-semibold tracking-wide">
                        {t("title")}
                    </h3>

                    <p className="max-w-md text-sm text-neutral-600 dark:text-slate-400">
                        {isAdmin ? t("description") : t("adminOnly")}
                    </p>
                </div>

                {isAdmin && (
                    <>
                        {isLoading ? (
                            <div className="h-16 w-full max-w-md animate-pulse rounded-lg bg-neutral-100 dark:bg-slate-800" />
                        ) : (
                            <>
                                <div className="grid w-full max-w-md grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 text-left dark:border-slate-800">
                                        {hasBranches ? (
                                            <CheckCircle2
                                                size={18}
                                                className="shrink-0 text-emerald-500"
                                            />
                                        ) : (
                                            <CircleAlert
                                                size={18}
                                                className="shrink-0 text-amber-500"
                                            />
                                        )}

                                        <span className="text-sm font-medium">
                                            {t("branches")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 text-left dark:border-slate-800">
                                        {hasCategories ? (
                                            <CheckCircle2
                                                size={18}
                                                className="shrink-0 text-emerald-500"
                                            />
                                        ) : (
                                            <CircleAlert
                                                size={18}
                                                className="shrink-0 text-amber-500"
                                            />
                                        )}

                                        <span className="text-sm font-medium">
                                            {t("categories")}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {!hasBranches && (
                                        <button
                                            type="button"
                                            onClick={handleManageBranches}
                                            className="shrink-0 cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            {t("createBranch")}
                                        </button>
                                    )}

                                    {!hasCategories && <CategoryButton />}

                                    {canCreateProduct && <AddProductButton />}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
