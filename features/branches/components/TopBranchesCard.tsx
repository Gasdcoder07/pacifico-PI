import { useTranslations } from "next-intl";

interface TopBranchesCardProps {
  isLoading: boolean;
  branches: any[] | null;
}

const DEFAULT_TOP_BRANCHES = [
  { id: "mock-1", name: "Manzanillo", totalSales: 128000 },
  { id: "mock-2", name: "Las Brisas", totalSales: 97720 },
  { id: "mock-3", name: "Valle de las Garzas", totalSales: 72190 },
];

const rankStyles = [
  { bg: "bg-amber-500/10", badge: "bg-amber-500 text-white" },
  { bg: "bg-slate-500/10", badge: "bg-slate-500 text-white" },
  { bg: "bg-orange-500/10", badge: "bg-orange-600 text-white" },
];

const TopBranchesCard = ({ isLoading, branches }: TopBranchesCardProps) => {
  const t = useTranslations("Branches.TopBranchesCard");

  if (isLoading) {
    return (
      <div className="h-54 w-2/5 animate-pulse rounded-lg bg-neutral-200 transition-all duration-200" />
    );
  }

  const displayBranches = DEFAULT_TOP_BRANCHES.map((defaultBranch, index) => {
    const realBranch = branches?.[index];

    return {
      id: realBranch?.id ?? defaultBranch.id,
      name: realBranch?.name ?? defaultBranch.name,
      totalSales:
        realBranch?.totalSales && realBranch.totalSales > 0
          ? realBranch.totalSales
          : defaultBranch.totalSales,
    };
  });

  // Formateador estándar de JS para mostrar solo '$' con comas
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex w-2/5 flex-col gap-4 rounded-lg border border-neutral-200 p-4 shadow-sm">
      <h3 className="text-xl font-bold text-neutral-900">{t("title")}</h3>

      <div className="flex flex-col gap-2">
        {displayBranches.map((branch, index) => {
          const style = rankStyles[index] || rankStyles[2];

          return (
            <div
              key={branch.id || index}
              className={`flex items-center justify-between gap-4 rounded-lg p-2 shadow-sm ${style.bg}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
                >
                  {index + 1}
                </div>
                <h4 className="truncate text-sm font-semibold text-neutral-900">
                  {branch.name}
                </h4>
              </div>

              <p className="shrink-0 text-sm font-bold text-neutral-900">
                {formatMoney(branch.totalSales)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBranchesCard;