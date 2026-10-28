import { MetricCard } from "@/features/dashboard/components/sales/MetricCard";
import { SalesOverviewChart } from "@/features/dashboard/components/sales/OverviewChart";
import { SalesByBranchChart } from "@/features/dashboard/components/sales/SalesByBranchChart";
import { TopProductsChart } from "@/features/dashboard/components/sales/TopProductsChart";
import { DollarSign, Receipt, TrendingUp, Package } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("SalesPage");
  const format = useFormatter();

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("metrics.totalSales")}
          value={format.number(182450, {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          })}
          icon={DollarSign}
        />
        <MetricCard
          title={t("metrics.transactions")}
          value={format.number(1437)}
          icon={Receipt}
        />
        <MetricCard
          title={t("metrics.averageTicket")}
          value={format.number(127, {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          })}
          icon={TrendingUp}
        />
        <MetricCard
          title={t("metrics.productsSold")}
          value={format.number(674)}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesOverviewChart />
        <SalesByBranchChart />

        <div className="lg:col-span-2">
          <TopProductsChart />
        </div>
      </div>
    </div>
  );
};

export default Page;