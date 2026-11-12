
"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchEmptyStateProps {
    onClearSearch: () => void;
}

const SearchEmptyState = ({ onClearSearch }: SearchEmptyStateProps) => {
    const t = useTranslations("SearchEmptyState");

    return (
        <div className="flex h-full min-h-0 flex-col items-center justify-center">
            <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <SearchX size={28} />
                </div>

                <div className="mb-2 flex flex-col gap-2">
                    <h3 className="text-xl font-semibold tracking-wide">
                        {t("title")}
                    </h3>

                    <p className="max-w-xs text-sm text-neutral-600 dark:text-slate-400">
                        {t("description")}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClearSearch}
                    className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {t("clearSearch")}
                </button>
            </div>
        </div>
    );
};

export default SearchEmptyState;
