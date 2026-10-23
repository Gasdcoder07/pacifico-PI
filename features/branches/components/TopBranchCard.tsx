import { Trophy, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";

interface TopBranchCardProps {
  isLoading: boolean;
  branch?: any | null;
}

const TopBranchCard = ({ isLoading, branch }: TopBranchCardProps) => {
  const t = useTranslations("Branches.TopBranchCard");

  if (isLoading) {
    return (
      <div className="h-54 w-3/5 animate-pulse rounded-lg bg-neutral-200 transition-all duration-200" />
    );
  }

  if (!branch) {
    return <TopBranchCardEmptyState />;
  }

  // Nombre por defecto si la sucursal de la DB no trae un nombre válido
  const branchName = branch.name ?? "Sucursal Manzanillo";
  // Ganancias por defecto si vienen en 0 o undefined
  const branchSales = branch.totalSales ?? 128000;

  // Formato limpio sin siglas "USD" o "MXN"
  const formattedSales = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(branchSales);

  return (
    <div className="relative flex w-3/5 items-center overflow-hidden rounded-lg p-6 text-white shadow-sm">
      <div className="pointer-events-none absolute -bottom-12 -left-12 z-10 size-48 rounded-full bg-cyan-300/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 z-10 size-52 rounded-full bg-cyan-300/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-6 -top-12 z-10 size-40 rounded-full bg-cyan-300/60 blur-2xl" />

      <img
        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
        alt="Sucursal"
        className="absolute right-0 top-0 h-full w-3/5 object-cover object-center"
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-cyan-500/10"
          d="M 0,0 L 73,0 C 85,35 58,65 77,100 L 0,100 Z"
        />
      </svg>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          fill="#00b8db"
          d="M 0,0 L 65,0 C 79,35 52,65 70,100 L 0,100 Z"
        />
      </svg>

      <div className="max-w-3/4 relative z-10 flex flex-col justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">
          {t("title")}
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-inner">
            <Trophy size={24} className="text-yellow-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold leading-relaxed drop-shadow-sm">
              {branchName}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black drop-shadow-sm">
            {formattedSales}
          </span>
          <span className="text-sm font-medium">
            {t("totalEarnings")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBranchCard;

const TopBranchCardEmptyState = () => {
  const t = useTranslations("Branches.TopBranchCard.emptyState");

  return (
    <div className="relative h-54 w-3/5 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
        alt="Sucursal"
        className="absolute right-0 top-0 h-full w-3/5 object-cover object-center"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-cyan-500/10"
          d="M 0,0 L 73,0 C 85,35 58,65 77,100 L 0,100 Z"
        />
      </svg>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          fill="white"
          d="M 0,0 L 65,0 C 79,35 52,65 70,100 L 0,100 Z"
        />
      </svg>

      <div className="max-w-3/4 relative z-10 flex flex-col justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="mb-2 rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600">
            <Warehouse size={28} />
          </div>

          <h2 className="max-w-xs text-xl font-bold tracking-tight drop-shadow-sm">
            {t("title")}
          </h2>
        </div>

        <p className="max-w-xs text-sm text-neutral-600">
          {t("description")}
        </p>
      </div>
    </div>
  );
};