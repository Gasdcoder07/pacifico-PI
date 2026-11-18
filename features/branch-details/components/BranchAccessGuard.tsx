"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBranchById } from "@/features/branches/services/branch.service";

import axios from "axios";
import Link from "next/link";
import { CircleAlert, ShieldX } from "lucide-react";

interface BranchAccessGuardProps {
    id: string;
    children: ReactNode;
}

const BranchAccessGuard = ({ id, children }: BranchAccessGuardProps) => {
    const t = useTranslations("BranchAccessGuard");
    const { user, loading } = useAuth();

    const branchId = Number(id);
    const isValidId = /^[1-9]\d*$/.test(id) && Number.isSafeInteger(branchId);

    const { isPending, isError, error, refetch } = useQuery({
        queryKey: ["getBranch", branchId],
        queryFn: () => getBranchById(branchId),
        enabled: !loading && !!user && isValidId,
        staleTime: 60_000,
        retry: false,
    });

    if (!isValidId) {
        return <BranchErrorPage status={404} />;
    }

    if (loading || !user) {
        return <BranchPageSkeleton />;
    }

    if (isPending) {
        return <BranchPageSkeleton />;
    }

    if (isError) {
        const status = axios.isAxiosError(error)
            ? error.response?.status
            : undefined;

        if (status === 403 || status === 404) {
            return <BranchErrorPage status={status} />;
        }

        if (status === 401) {
            return <BranchErrorPage status={401} />;
        }

        return (
            <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="flex flex-col justify-center items-center gap-6 p-8 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex justify-center items-center rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
                        <CircleAlert size={28} />
                    </div>

                    <div className="flex max-w-md flex-col gap-2">
                        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-slate-50">
                            {t("loadError.title")}
                        </h3>

                        <p className="text-sm leading-relaxed text-neutral-500 dark:text-slate-400">
                            {t("loadError.description")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="rounded-lg bg-cyan-400 px-4 py-2 font-medium text-white transition-colors ease-in-out duration-200 hover:bg-cyan-500 dark:text-slate-950 cursor-pointer"
                    >
                        {t("loadError.retry")}
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default BranchAccessGuard;

const BranchErrorPage = ({ status }: { status: 401 | 403 | 404 }) => {
    const t = useTranslations("BranchAccessGuard.errors");
    const isUnauthorized = status === 401;

    const title = t(`${status}.title`);
    const description = t(`${status}.description`);

    return (
        <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="flex flex-col justify-center items-center gap-6 p-8 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex justify-center items-center rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
                    <ShieldX size={28} />
                </div>

                <div className="flex max-w-md flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-slate-50">
                        {title}
                    </h3>

                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>

                <Link
                    href={isUnauthorized ? "/login" : "/branches"}
                    className="rounded-lg bg-cyan-400 px-4 py-2 font-medium text-white transition-colors ease-in-out duration-200 hover:bg-cyan-500 dark:text-slate-950"
                >
                    {isUnauthorized ? t("actions.login") : t("actions.backToBranches")}
                </Link>
            </div>
        </div>
    );
};

const BranchPageSkeleton = () => {
    return (
        <section className="flex min-h-full flex-col gap-8 p-8 animate-pulse">
            <div className="h-6 w-48 rounded bg-neutral-200 dark:bg-slate-800" />
            
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="h-40 w-full bg-neutral-200 dark:bg-slate-800" />

                <div className="flex flex-col gap-4 p-6 sm:flex-row">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="size-16 shrink-0 rounded-full bg-neutral-200 dark:bg-slate-800" />

                        <div className="flex flex-col gap-2">
                            <div className="h-5 w-32 rounded bg-neutral-200 dark:bg-slate-800" />
                            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-slate-800" />
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-slate-800" />
                        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-slate-800" />
                        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="h-8 w-48 rounded bg-neutral-200 dark:bg-slate-800" />
                        <div className="h-6 w-64 max-w-full rounded bg-neutral-200 dark:bg-slate-800" />
                    </div>

                    <div className="h-10 w-42 rounded bg-neutral-200 dark:bg-slate-800" />
                </div>

                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-24 w-full rounded-lg bg-neutral-200 dark:bg-slate-800"
                    />
                ))}
            </div>
        </section>
    );
};