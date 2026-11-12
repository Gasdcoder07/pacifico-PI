"use client";

import { useTranslations } from "next-intl";
import DashboardContainer from "./DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboard.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardLayout = () => {
    const t = useTranslations("SalesPage");
    const { user: currentUser } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData
    });

    const isAdmin = currentUser?.rol_id === 1;

    return (
        <section className="h-full flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            <h3 className="text-2xl font-bold">{t("title")}</h3>

            {isLoading ? (
                <div className="text-gray-400">Cargando métricas...</div>
            ) : (
                data?.data && <DashboardContainer data={data.data} isAdmin={isAdmin} />
            )}
        </section>
    );
};

export default DashboardLayout;