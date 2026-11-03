import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, icon: Icon }: MetricCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-neutral-800 dark:bg-black">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-300">{title}</span>
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</span>
      </div>
      <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
        <Icon size={24} />
      </div>
    </div>
  );
};
