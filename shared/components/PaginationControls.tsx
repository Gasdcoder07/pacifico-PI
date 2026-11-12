
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    isFetching?: boolean;
    onPageChange: (page: number) => void;
}

const inputStyles =
    "w-full p-1.5 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-lg focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 text-center text-sm font-medium text-neutral-900 dark:text-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

const PaginationControls = ({ currentPage, totalPages, isFetching = false, onPageChange }: PaginationControlsProps) => {
    const t = useTranslations("Pagination");

    const [pageInput, setPageInput] = useState(String(currentPage));

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    const handlePageSubmit = () => {
        if (isFetching) return;

        const nextPage = Number(pageInput);

        if (
            !pageInput.trim() ||
            !Number.isInteger(nextPage) ||
            nextPage < 1 ||
            nextPage > totalPages
        ) {
            setPageInput(String(currentPage));
            return;
        }

        if (nextPage !== currentPage) {
            onPageChange(nextPage);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label={t("label")}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-slate-800"
        >
            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-slate-400">
                <span>{t("page")}</span>

                <input
                    type="text"
                    inputMode="numeric"
                    aria-label={t("page")}
                    value={pageInput}
                    disabled={isFetching}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                            setPageInput(value);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                    onBlur={handlePageSubmit}
                    style={{
                        width: `${Math.max(2, String(totalPages).length) + 3}ch`,
                    }}
                    className={inputStyles}
                />

                <span>{t("of")} {totalPages}</span>
            </div>

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
