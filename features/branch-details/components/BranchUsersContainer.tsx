"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/features/auth/hooks/useAuth";
import BranchUsersCard from "./BranchUsersCard";
import CreateUserButton from "@/features/users/components/CreateUserButton";
import { getBranchById } from "@/features/branches/services/branch.service";
import { User } from "@/features/users/types/user";

const BranchUsersContainer = ({ id }: { id: string | number }) => {
  const t = useTranslations("BranchDetails.usersContainer");
  const { user: currentUser } = useAuth();

  const { data: branchData, isLoading: isLoadingBranch } = useQuery({
    queryKey: ["getBranch", Number(id)],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  });

  const rawUsers = branchData?.data?.usuarios ?? [];
  const haveManager = branchData?.data.gerente !== null;

  const users = rawUsers
    .filter((user) => String(user.id) !== String(currentUser?.id))
    .sort((a, b) => (Number(b.rol_id) === 2 ? 1 : Number(a.rol_id) === 2 ? -1 : 0));

  if (isLoadingBranch) return <UsersContainerSkeleton />;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-semibold tracking-wide text-neutral-900 dark:text-slate-50">
                        {t("title")}
                    </h4>
                    <p className="text-sm text-neutral-500 dark:text-[#8493A8]">{t("subtitle")}</p>
                </div>

                <CreateUserButton
                    isDisabled={isLoadingBranch}
                    branch_id={branchData?.data.id}
                    company_id={branchData?.data.company_id}
                    managerExists={haveManager}
                    showBranchSelect={false}
                />
            </div>

            <div className="flex flex-col gap-4">
                {users.length === 0 ? (
                    <EmptyState />
                ) : (
                    users.map((user: User) => {
                        return (
                            <div
                                key={user.id}
                                className="flex items-center gap-4"
                            >
                                <BranchUsersCard
                                    user={user}
                                    branchId={Number(id)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
  );
};

export default BranchUsersContainer;

const EmptyState = () => {
  const t = useTranslations("BranchDetails.usersContainer.emptyState");

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-12 text-center shadow-sm">
      <div className="rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
        <Users size={28} />
      </div>

      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-slate-50">
          {t("title")}
        </h3>

        <p className="text-sm leading-relaxed text-neutral-600 dark:text-slate-400">
          {t("description")}
        </p>
      </div>
    </div>
  );
};

const UsersContainerSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 dark:bg-slate-800 shadow-sm" />
  );
};
