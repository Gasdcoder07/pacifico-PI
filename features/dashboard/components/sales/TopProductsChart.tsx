"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    return (
        <div className="w-full bg-white dark:bg-black text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm p-4 [--ejes:#737373] dark:[--ejes:#d4d4d4] [--cuadricula:#e5e5e5] dark:[--cuadricula:#262626] [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#171717] [--tooltip-texto:#171717] dark:[--tooltip-texto:#ffffff] [--cursor:#f5f5f5] dark:[--cursor:#171717]">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Productos más vendidos</h3>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--cuadricula)" />
                        <XAxis type="number" tick={{ fontSize: 12, fill: "var(--ejes)" }} stroke="var(--ejes)" />
                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "var(--ejes)" }} stroke="var(--ejes)" />
                        <Tooltip cursor={{ fill: "var(--cursor)" }} contentStyle={{ backgroundColor: "var(--tooltip-fondo)", color: "var(--tooltip-texto)", borderRadius: "12px", border: "1px solid var(--cuadricula)", fontSize: "13px" }} labelStyle={{ color: "var(--tooltip-texto)" }} itemStyle={{ color: "var(--tooltip-texto)" }} formatter={(value) => [`${Number(value)} unidades`, "Vendidas"]} />
                        <Bar dataKey="ventas" fill="#0891b2" radius={[0, 6, 6, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};