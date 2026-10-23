"use client";

import { useQuery } from "@tanstack/react-query";

import BranchDropdownActionButton from "@/features/branches/components/BranchDropdownActionButton";
import { getBranchById } from "@/features/branches/services/branch.service";
import { useTranslations } from "next-intl";
import { formatPhoneNumber } from "@/shared/utils/formatters";

import { House, Mail, Phone, Pin } from "lucide-react";

const BranchDetailsCard = ({ id }: { id: string | number }) => {
  // Hook llamado correctamente dentro del componente
  const t = useTranslations("BranchDetails.card");

  const { data, isLoading } = useQuery({
    queryKey: ["getBranch", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  });

  const branch = data?.data;
  const manager = data?.data.gerente;

  if (isLoading) return <BrachDetailsCardSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 text-neutral-600">
          <House size={16} />
          <span className="text-sm font-semibold">
            {t("breadcrumb")} / {branch?.name}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        {/* Div de la imagen */}
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            className="block h-full w-full object-cover object-center"
            src={branch?.foto_url ? branch?.foto_url : '/default_branch.webp'}
            alt={branch?.name ?? t("defaultBranchAlt")}
          />

          <div className="absolute left-6 top-1/3 z-10 flex gap-4">
            <h3 className="text-3xl font-bold tracking-wider text-white">
              {branch?.name}
            </h3>
          </div>

          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Div de la información */}
        <div className="relative -mt-4 flex items-stretch gap-4 rounded-lg bg-white py-4 shadow-sm">
          <div className="flex w-1/4 items-center gap-4 border-r border-neutral-200 px-6 py-2">
            <img
              src={manager?.foto_url ? manager.foto_url : '/default_profile.webp'}
              alt={t("managerRole")}
              className="size-16 rounded-full border border-neutral-200 object-cover object-center shadow"
            />

            <div className="flex min-w-0 flex-col gap-0">
                {
                    manager ? (
                        <>                        
                            <p className="text-lg font-medium text-neutral-900">
                                {manager?.name} {manager?.last_name}
                            </p>
                            <span className="text-sm text-neutral-400">
                                {t("managerRole")}
                            </span>
                        </>
                    ) : (
                        <p className="font-medium">{t("noManager")}</p>
                    )
                }
            </div>
          </div>

          <div className="flex w-3/4 items-start justify-between gap-4 px-6 py-2 text-sm text-neutral-600">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-1 min-w-0 items-center gap-4">
                <Pin size={18} className="shrink-0" />
                <span className="truncate">{branch?.direction}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={18} className="shrink-0" />
                <span className="truncate">
                  {formatPhoneNumber(branch?.phone)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} className="shrink-0" />
                <span className="truncate">{branch?.contact_info}</span>
              </div>
            </div>

            <BranchDropdownActionButton branch={branch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailsCard;

const BrachDetailsCardSkeleton = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 shadow-sm h-full w-full" />
  );
};