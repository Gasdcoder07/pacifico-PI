"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type SalesData = {
    mes: string;
    ventas: number;
};

const data: SalesData[] = [
    { mes: "Ene", ventas: 4200 },
    { mes: "Feb", ventas: 3800 },
    { mes: "Mar", ventas: 5100 },
    { mes: "Abr", ventas: 4600 },
    { mes: "May", ventas: 5300 },
    { mes: "Jun", ventas: 7200 },
    { mes: "Jul", ventas: 6300 },
    { mes: "Ago", ventas: 3200 },
    { mes: "Sep", ventas: 6800 },
    { mes: "Oct", ventas: 6100 },
    { mes: "Nov", ventas: 6900 },
    { mes: "Dic", ventas: 7100 },
];

export function SalesOverviewChart() {
    return (
        <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl p-5 [--ejes:#737373] dark:[--ejes:#94a3b8] [--cuadricula:#e5e5e5] dark:[--cuadricula:#1e293b] [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#0f172a] [--tooltip-texto:#171717] dark:[--tooltip-texto:#f8fafc] [--serie:#0891b2] dark:[--serie:#22d3ee]">
            <h2 className="text-neutral-700 dark:text-slate-50">Resumen de Ventas</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cuadricula)" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--ejes)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--ejes)" }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--tooltip-fondo)", color: "var(--tooltip-texto)", borderRadius: "12px", border: "1px solid var(--cuadricula)", fontSize: "13px" }} labelStyle={{ color: "var(--tooltip-texto)" }} itemStyle={{ color: "var(--tooltip-texto)" }} />
                    <Line type="monotone" dataKey="ventas" stroke="var(--serie)" strokeWidth={2} dot={{ r: 4, fill: "var(--serie)" }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}