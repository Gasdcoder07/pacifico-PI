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
    <div className="w-full rounded-lg border border-neutral-200 bg-white p-4 text-neutral-900 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 [--ejes:#737373] dark:[--ejes:#94a3b8] [--cuadricula:#e5e5e5] dark:[--cuadricula:#1e293b] [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#0f172a] [--tooltip-texto:#171717] dark:[--tooltip-texto:#f8fafc] [--cursor:#f5f5f5] dark:[--cursor:#1e293b] [--serie:#0891b2] dark:[--serie:#22d3ee]">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-slate-50">
        {t("title")}
      </h3>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="var(--cuadricula)"
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "var(--ejes)" }}
              stroke="var(--ejes)"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12, fill: "var(--ejes)" }}
              stroke="var(--ejes)"
            />
            <Tooltip
              cursor={{ fill: "var(--cursor)" }}
              contentStyle={{
                backgroundColor: "var(--tooltip-fondo)",
                color: "var(--tooltip-texto)",
                borderRadius: "12px",
                border: "1px solid var(--cuadricula)",
                fontSize: "13px",
              }}
              labelStyle={{ color: "var(--tooltip-texto)" }}
              itemStyle={{ color: "var(--tooltip-texto)" }}
              formatter={(value: any) => [
                `${Number(value)} ${t("units")}`,
                t("soldLabel"),
              ]}
            />
            <Bar dataKey="ventas" fill="var(--serie)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};