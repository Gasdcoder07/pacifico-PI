import { useTranslations } from "next-intl";
import DashboardContainer from "./DashboardContainer";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/dashboard.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardLayout = () => {
    const t = useTranslations("SalesPage");
    const { user: currentUser } = useAuth();

    const { data } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData
    });

    const isAdmin = currentUser?.rol_id === 1;

    return (
        <section className="h-full flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            <h3 className="text-2xl font-bold">{t("title")}</h3>

            <DashboardContainer/>
        </section>
    );
};

export default DashboardLayout;
