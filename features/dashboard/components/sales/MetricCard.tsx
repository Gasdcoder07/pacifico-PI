import { LucideIcon } from "lucide-react";

type MetricCardProps = {
    title: string;
    value: string;
    icon: LucideIcon;
};

export function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
    return (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col gap-2 transition-colors duration-200">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-300">
                <Icon size={18} />
                <span className="text-sm">{title}</span>
            </div>

            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                {value}
            </span>
        </div>
    );
}