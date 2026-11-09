import { Sale } from "@/features/sell/types/sale";
import { SaleCard } from "./SaleCard";
import { useTranslations } from "next-intl";
import { ReceiptText } from "lucide-react";

interface SalesContainerProps {
    sales?: Sale[];
    isLoading: boolean;
}

const SalesContainer = ({ sales, isLoading }: SalesContainerProps) => {
    if (isLoading) return <Skeleton />;

    if (!sales?.length) return <EmptyState/>

    return (
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 pb-4 sm:pb-6 lg:pb-8">
            {sales?.map((sale) => {
                return <SaleCard key={sale.id} sale={sale} />;
            })}
        </div>
    );
};

export default SalesContainer;

const EmptyState = () => {
    const t = useTranslations("SalesPage.history.emptyState");

    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-full border border-cyan-200 bg-cyan-50 p-4 text-cyan-600 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400">
                <ReceiptText size={28} />
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

const Skeleton = () => {
    return (
        <div className="flex-1 animate-pulse duration-200 ease-in-out transition-all bg-neutral-200 dark:bg-slate-800 flex min-h-0 min-w-0 rounded-lg" />
    );
};
