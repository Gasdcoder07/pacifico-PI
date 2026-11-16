"use client";

import { useFormatter, useTranslations } from "next-intl";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
    data: Record<string, number>[];
}

const MONTH_INDEX: Partial<Record<string, number>> = {
    enero: 0, ene: 0, january: 0, jan: 0,
    febrero: 1, feb: 1, february: 1,
    marzo: 2, mar: 2, march: 2,
    abril: 3, abr: 3, april: 3, apr: 3,
    mayo: 4, may: 4,
    junio: 5, jun: 5, june: 5,
    julio: 6, jul: 6, july: 6,
    agosto: 7, ago: 7, august: 7, aug: 7,
    septiembre: 8, sep: 8, sept: 8, september: 8,
    octubre: 9, oct: 9, october: 9,
    noviembre: 10, nov: 10, november: 10,
    diciembre: 11, dic: 11, december: 11, dec: 11,
};

export function OverviewChart({ data }: OverviewChartProps) {
    const t = useTranslations("SalesPage.overviewChart")
    const format = useFormatter();

    const chartData = data.flatMap((item) => {
        const entry = Object.entries(item)[0];

        if (!entry) return [];

        const [mes, ventas] = entry;

        return [{ mes, ventas }];
    });

    const formatMonth = (
        value: unknown,
        style: "short" | "long" = "short"
    ): string => {
        const originalLabel = String(value ?? "");

        const normalizedMonth = originalLabel
            .trim()
            .toLowerCase()
            .replace(/\.$/, "");

        const monthIndex = MONTH_INDEX[normalizedMonth];

        if (monthIndex === undefined) {
            return originalLabel;
        }

        // La fecha se usa únicamente para formatear el nombre del mes.
        return format.dateTime(
            new Date(Date.UTC(2000, monthIndex, 1)),
            {
            month: style,
            timeZone: "UTC",
            }
        );
    };

      const formatValue = (value: unknown): string => {
        return typeof value === "number"
        ? format.number(value)
        : String(value ?? "");
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl p-5 [--ejes:#737373] dark:[--ejes:#94a3b8] [--cuadricula:#e5e5e5] dark:[--cuadricula:#1e293b] [--tooltip-fondo:#ffffff] dark:[--tooltip-fondo:#0f172a] [--tooltip-texto:#171717] dark:[--tooltip-texto:#f8fafc] [--serie:#0891b2] dark:[--serie:#22d3ee] shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-slate-50 mb-4">{t("title")}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--cuadricula)" />
                    <XAxis
                        dataKey="mes"
                        tickFormatter={(value) => formatMonth(value, "short")}
                        tick={{ fontSize: 12, fill: "var(--ejes)" }} />
                    <YAxis
                        tickFormatter={formatValue}
                        tick={{ fontSize: 12, fill: "var(--ejes)" }} />
                    <Tooltip 
                        labelFormatter={(label) => formatMonth(label, "long")}
                        formatter={formatValue}
                        contentStyle={{ backgroundColor: "var(--tooltip-fondo)", color: "var(--tooltip-texto)", borderRadius: "12px", border: "1px solid var(--cuadricula)", fontSize: "13px" }} 
                        labelStyle={{ color: "var(--tooltip-texto)" }} 
                        itemStyle={{ color: "var(--tooltip-texto)" }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="ventas" 
                        stroke="var(--serie)"
                        name={t("salesLabel")}
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "var(--serie)" }} 
                        activeDot={{ r: 6 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}