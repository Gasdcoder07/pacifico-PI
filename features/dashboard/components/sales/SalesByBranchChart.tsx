"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type BranchData = {
    sucursal: string;
    ventas: number;
};

const data: BranchData[] = [
    { sucursal: "Centro", ventas: 4200 },
    { sucursal: "Norte", ventas: 3100 },
    { sucursal: "Sur", ventas: 2800 },
    { sucursal: "Poniente", ventas: 1900 },
];

const COLORS = ["#0891b2", "#3b82f6", "#f59e0b", "#10b981"];

export function SalesByBranchChart() {
    const total = data.reduce((acc, item) => acc + item.ventas, 0);

    return (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#171717] [--tooltip-texto:#171717] dark:[--tooltip-texto:#ffffff] [--tooltip-borde:#e5e5e5] dark:[--tooltip-borde:#262626]">
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-white mb-4">Ventas por Sucursal</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} dataKey="ventas" nameKey="sucursal" cx="50%" cy="50%" outerRadius={100} stroke="none" label={(props: any) => `${props.sucursal} ${((props.ventas / total) * 100).toFixed(0)}%`}>
                        {data.map((item, index) => (
                            <Cell key={item.sucursal} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--tooltip-fondo)", color: "var(--tooltip-texto)", borderRadius: "12px", border: "1px solid var(--tooltip-borde)", fontSize: "13px" }} labelStyle={{ color: "var(--tooltip-texto)" }} itemStyle={{ color: "var(--tooltip-texto)" }} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}