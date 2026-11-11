"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    isFetching?: boolean;
    onPageChange: (page: number) => void;
}

const PaginationControls = ({ currentPage, totalPages, isFetching, onPageChange }: PaginationControlsProps) => {
    const t = useTranslations("Pagination");

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label={t("label")}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-slate-800"
        >
            <span className="text-sm text-neutral-600 dark:text-slate-400">
                {t("pageInfo", { currentPage, totalPages })}
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isFetching}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <ChevronLeft size={16} />
                    {t("previous")}
                </button>

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isFetching}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {t("next")}
                    <ChevronRight size={16} />
                </button>
            </div>
        </nav>
    );
};

export default PaginationControls;
