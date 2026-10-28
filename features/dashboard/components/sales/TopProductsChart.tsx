"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

const data = [
  { name: "Labubu Vaca", ventas: 4000 },
  { name: "Labubu Lily", ventas: 3000 },
  { name: "Labubu Dorado", ventas: 2000 },
  { name: "Labubu Arcoiris", ventas: 2780 },
  { name: "Labubu Radillo", ventas: 1890 },
  { name: "Labubu Rojo", ventas: 2390 },
  { name: "Labubu Morado", ventas: 3490 },
];

export const TopProductsChart = () => {
  const t = useTranslations("SalesPage.topProductsChart");

  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">{t("title")}</h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: any) => [
                `${Number(value)} ${t("units")}`,
                t("soldLabel"),
              ]}
            />
            <Bar dataKey="ventas" fill="#0891b2" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};