"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFormatter, useTranslations } from "next-intl";

type BranchData = {
  sucursalKey: string;
  ventas: number;
};

const rawData: BranchData[] = [
  { sucursalKey: "center", ventas: 4200 },
  { sucursalKey: "north", ventas: 3100 },
  { sucursalKey: "south", ventas: 2800 },
  { sucursalKey: "west", ventas: 1900 },
];

const COLORS = ["var(--serie-1)", "var(--serie-2)", "var(--serie-3)", "var(--serie-4)"];

export function SalesByBranchChart() {
  const t = useTranslations("SalesPage.branchChart");
  const tBranches = useTranslations("SalesPage.branches");
  const format = useFormatter();

  const data = rawData.map((item) => ({
    ...item,
    sucursal: tBranches(item.sucursalKey),
  }));

  const total = data.reduce((acc, item) => acc + item.ventas, 0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#0f172a] [--tooltip-texto:#171717] dark:[--tooltip-texto:#f8fafc] [--tooltip-borde:#e5e5e5] dark:[--tooltip-borde:#1e293b] [--serie-1:#0891b2] dark:[--serie-1:#22d3ee] [--serie-2:#3b82f6] dark:[--serie-2:#60a5fa] [--serie-3:#f59e0b] dark:[--serie-3:#fbbf24] [--serie-4:#10b981] dark:[--serie-4:#34d399]">
      <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-slate-50">
        {t("title")}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="ventas"
            nameKey="sucursal"
            cx="50%"
            cy="50%"
            outerRadius={100}
            stroke="none"
            label={(props: any) => (
              <text
                x={props.x}
                y={props.y}
                fill="var(--tooltip-texto)"
                textAnchor={props.textAnchor}
                dominantBaseline="central"
                fontSize={12}
              >
                {`${props.sucursal} ${((props.ventas / total) * 100).toFixed(0)}%`}
              </text>
            )}
          >
            {data.map((item, index) => (
              <Cell key={item.sucursal} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-fondo)",
              color: "var(--tooltip-texto)",
              borderRadius: "12px",
              border: "1px solid var(--tooltip-borde)",
              fontSize: "13px",
            }}
            labelStyle={{ color: "var(--tooltip-texto)" }}
            itemStyle={{ color: "var(--tooltip-texto)" }}
            formatter={(value: any) =>
              format.number(Number(value), {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
              })
            }
          />
          <Legend wrapperStyle={{ color: "var(--tooltip-texto)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}