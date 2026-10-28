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

const COLORS = ["#0891b2", "#3b82f6", "#f59e0b", "#10b981"];

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
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-neutral-700">
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
            label={(props: any) =>
              `${props.sucursal} ${((props.ventas / total) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e5e5",
              fontSize: "13px",
            }}
            formatter={(value: any) =>
              format.number(Number(value), {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
              })
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}