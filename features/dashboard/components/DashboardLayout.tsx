"use client";

import { useTranslations } from "next-intl";
import DashboardContainer from "./DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboard.service";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { exportSalesToExcel } from "@/features/sales/utils/generateReports"; 
import { useState } from "react";
import toast from "react-hot-toast";

const DashboardLayout = () => {
    const t = useTranslations("SalesPage");
    const { user: currentUser } = useAuth();
    const [loading, setIsLoading] = useState<boolean>(false);

    const { data, isLoading } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData
    });

    const isAdmin = currentUser?.rol_id === 1;

    const handleDownload = async () => {
        if (!data?.data || loading) return;
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const fecha = new Date().toISOString().split('T')[0];
            exportSalesToExcel(data.data, `Reporte_Ventas_${fecha}.xlsx`);
        } catch (err) {
            toast.error("No se pudo generar el reporte");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="h-full flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            <div className="flex-row flex justify-between">
                <h3 className="text-2xl font-bold">{t("title")}</h3>
                <button
                    onClick={handleDownload}
                    disabled={loading || !data?.data}
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-neutral-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-800 hover:border-neutral-400 dark:hover:border-slate-600 active:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shrink-0"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-600 dark:text-slate-400" />
                            <span>Generando...</span>
                        </>
                    ) : (
                        <>
                            <FileSpreadsheet className="w-4 h-4 text-neutral-600 dark:text-slate-400" />
                            <span>{t("export")}</span>
                        </>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="text-gray-400">Cargando métricas...</div>
            ) : (
                data?.data && <DashboardContainer data={data.data} isAdmin={isAdmin} />
            )}
        </section>
    );
};

export default DashboardLayout;