"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users.service";
import { User } from "../types/user";
import { useAuth } from "@/features/auth/hooks/useAuth";
import UsersCard from "./UsersCard";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";

interface UsersContainerProps {
  branchId?: string | number;
}

const UsersContainer = ({ branchId }: UsersContainerProps) => {
  const t = useTranslations("UsersPage.container");
  const scrollbarStyles =
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-600";

  const { user: currentUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const rawUsers = data?.data ?? [];

  const users = [...rawUsers].sort((a, b) => {
    if (String(a.id) === String(currentUser?.id)) return -1;
    if (String(b.id) === String(currentUser?.id)) return 1;
    return 0;
  });

  if (isLoading) return <UsersContainerSkeleton />;

  return (
    <section className="flex flex-1 min-h-0 min-w-0">
      <div className={`flex-1 min-h-0 overflow-y-auto ${scrollbarStyles}`}>
        {users.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user: User) => {
              const isMe = String(user.id) === String(currentUser?.id);
              const fallbackBranchId = (user as any).branch_id ?? 0;

              return (
                <div key={user.id} className="flex items-center gap-4">
                  <UsersCard
                    user={user}
                    isMe={isMe}
                    branchId={Number(branchId ?? fallbackBranchId)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersContainer;

const EmptyState = () => {
  const t = useTranslations("UsersPage.container.emptyState");

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

export const UsersContainerSkeleton = () => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 dark:bg-slate-800 shadow-sm h-full w-full" />
  );
};
