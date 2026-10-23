"use client";

import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../services/branch.service";
import { Building2, LucideIcon, MapPin, UserCheck, Warehouse } from "lucide-react";
import BranchCard from "./BranchCard";
import { useTranslations } from "next-intl";
import CreateBranchButton from "./CreateBranchButton";

const BranchesContainer = () => {
  const t = useTranslations("Branches");

  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });

  const branches = data ?? [];
  console.log(branches);

  const renderContent = (): React.ReactNode => {
    if (isLoading) {
      return (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <BranchCardSkeleton key={index} />
          ))}
        </>
      );
    }

    if (branches.length === 0) {
      return <BranchesEmptyState />;
    }

    return (
      <>
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            id={branch.id}
            name={branch.name}
            managerName={
                branch.gerentes?.length
                ? `${branch.gerentes[0].name} ${branch.gerentes[0].last_name}`
                : ""
            }
            managerPhoto={branch.gerentes?.[0]?.foto_url || "/default_profile.webp"}
            photo={branch.foto_url}
            status={branch.status}
            direction={branch.direction}
            phone={branch.phone}
            email={branch.contact_info}
          />
        ))}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold">{t("title")}</h3>

        <CreateBranchButton />
      </div>

      <div className="grid w-full gap-4 lg:grid-cols-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default BranchesContainer;

const BranchCardSkeleton = () => {
  return <div className="h-56 w-full rounded-lg bg-neutral-200 shadow-sm" />;
};

const BranchesEmptyState = () => {
  const t = useTranslations("Branches.emptyState");

  return (
    <div className="col-span-full flex w-full flex-col gap-6 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-2 rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600">
          <Warehouse size={28} />
        </div>
        <h3 className="mb-1 text-xl font-semibold tracking-wide">
          {t("title")}
        </h3>
        <p className="text-sm text-neutral-600">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-2">
        <BranchesEmptyStateStep
          step={1}
          icon={Building2}
          title={t("steps.step1.title")}
          description={t("steps.step1.description")}
        />

        <BranchesEmptyStateStep
          step={2}
          icon={MapPin}
          title={t("steps.step2.title")}
          description={t("steps.step2.description")}
        />

        <BranchesEmptyStateStep
          step={3}
          icon={UserCheck}
          title={t("steps.step3.title")}
          description={t("steps.step3.description")}
        />
      </div>
    </div>
  );
};

interface BranchesEmptyStateStepProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const BranchesEmptyStateStep = ({
  step,
  icon: Icon,
  title,
  description,
}: BranchesEmptyStateStepProps) => {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-dashed border-neutral-200 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full border border-brand-200 bg-brand-50 p-2 text-brand-600">
          <Icon size={22} />
        </div>
        <div className="flex size-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <span className="text-sm font-bold">{step}</span>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <h5 className="text-sm font-semibold">{title}</h5>
        <p className="max-w-50 text-sm text-neutral-600">{description}.</p>
      </div>
    </div>
  );
};