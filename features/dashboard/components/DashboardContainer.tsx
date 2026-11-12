import { MetricCard } from "@/features/dashboard/components/sales/MetricCard";
import { OverviewChart } from "@/features/dashboard/components/sales/OverviewChart";
import { SalesByBranchChart } from "@/features/dashboard/components/sales/SalesByBranchChart";
import { TopProductsChart } from "@/features/dashboard/components/sales/TopProductsChart";
import { DollarSign, Receipt, TrendingUp, Package } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

// 1. Definimos la estructura de los datos que vienen del backend
export interface DashboardData {
    raw_data: {
        average_ticket: number;
        saled_products: number;
        total_sales: number;
        transactions: number;
    };
    sales_branches: Record<string, number>[];
    sales_overview: Record<string, number>[];
    top_products: Record<string, number>[];
}

interface DashboardContainerProps {
    data: DashboardData;
    isAdmin: boolean;
}

// 2. Recibimos las props (data e isAdmin)
const DashboardContainer = ({ data, isAdmin }: DashboardContainerProps) => {
    const t = useTranslations("SalesPage");
    const format = useFormatter();

    // Extraemos las secciones de data para usarlas más fácilmente
    const { raw_data, sales_overview, sales_branches, top_products } = data;

    return (
        <div className="flex flex-col gap-6 pb-4 sm:pb-6 lg:pb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 3. Reemplazamos los valores estáticos por raw_data */}
                <MetricCard
                    title={t("metrics.totalSales")}
                    value={format.number(raw_data.total_sales, {
                        style: "currency",
                        currency: "MXN", // Puedes cambiarlo a USD si así lo requiere tu app
                        currencyDisplay: "narrowSymbol",
                    })}
                    icon={DollarSign}
                />
                <MetricCard
                    title={t("metrics.transactions")}
                    value={format.number(raw_data.transactions)}
                    icon={Receipt}
                />
                <MetricCard
                    title={t("metrics.averageTicket")}
                    value={format.number(raw_data.average_ticket, {
                        style: "currency",
                        currency: "MXN",
                        currencyDisplay: "narrowSymbol",
                    })}
                    icon={TrendingUp}
                />
                <MetricCard
                    title={t("metrics.productsSold")}
                    value={format.number(raw_data.saled_products)}
                    icon={Package}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="min-w-0">
                    {/* 4. Pasamos los datos a la gráfica general */}
                    <OverviewChart data={sales_overview} />
                </div>
                
                {/* 5. Condicionamos la gráfica de sucursales según el rol */}
                {isAdmin && (
                    <div className="min-w-0">
                        <SalesByBranchChart data={sales_branches} />
                    </div>
                )}

                <div className="min-w-0 lg:col-span-2">
                    {/* 6. Pasamos los datos a la gráfica de productos */}
                    <TopProductsChart data={top_products} />
                </div>
            </div>
        </div>
    );
};

export default DashboardContainer;