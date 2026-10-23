"use client";


import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBranchById } from "@/features/branches/services/branch.service";
import { getUsers } from "@/features/users/services/users.service";
import { User } from "@/features/users/types/user";
import CreateUserButton from "@/features/users/components/CreateUserButton";
import UsersCard from "@/features/users/components/UsersCard";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

const BranchUsersContainer = ({ id }: { id: string | number }) => {
  const t = useTranslations("BranchDetails.usersContainer");
  const { user: currentUser } = useAuth();

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: branchData, isLoading: isLoadingBranch } = useQuery({
    queryKey: ["getBranch", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  });

  const rawUsers = usersData?.data ?? [];
  const users = rawUsers.filter(
    (user) => String(user.id) !== String(currentUser?.id)
  );

  if (isLoadingUsers) return <UsersContainerSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold tracking-wide text-neutral-900">
            {t("title")}
          </h4>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>

        <CreateUserButton
          isDisabled={isLoadingBranch}
          branch_id={branchData?.data.id}
          company_id={branchData?.data.company_id}
        />
      </div>

      <div className="flex flex-col gap-4">
        {users.length === 0 ? (
          <EmptyState />
        ) : (
          users.map((user: User) => {
            const isMe = String(user.id) === String(currentUser?.id);

            return (
              <div key={user.id} className="flex items-center gap-4">
                <UsersCard user={user} isMe={isMe} branchId={branchData?.data.id}/>
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
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600">
        <Users size={28} />
      </div>

      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="text-xl font-semibold text-neutral-900">
          {t("title")}
        </h3>

        <p className="text-sm leading-relaxed text-neutral-600">
          {t("description")}
        </p>
      </div>
    </div>
  );
};

const UsersContainerSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 shadow-sm" />
  );
};