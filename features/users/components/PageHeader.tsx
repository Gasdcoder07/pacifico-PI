"use client";

import CreateUserButton from "./CreateUserButton";

import { useTranslations } from "next-intl";
import { UserProfile } from "@/features/auth/types/authInterfaces";

interface PageHeaderProps {
    currentUser?: UserProfile | null;
    canCreateUsers: boolean;
    isLoading: boolean;
}

const PageHeader = ({ isLoading, currentUser, canCreateUsers = false } : PageHeaderProps) => {
    const t = useTranslations("UsersPage");

    const role = currentUser?.rol_id;
    const isAdmin = role === 1;
    const isManager = role === 2;

    if (isLoading) return <Skeleton/>

    return (
        <div className="flex gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">{t("title")}</h3>
                <p className="text-sm text-neutral-500 dark:text-[#8493A8]">{isManager ? t("subtitleManager") : t("subtitleAdmin")}</p>
            </div>

            {
                currentUser && canCreateUsers && (
                    isAdmin ? (
                        <CreateUserButton
                            key={`admin-${currentUser.id}`}
                            isDisabled={false}
                            company_id={currentUser.company_id}
                            showBranchSelect={true}
                            isAdmin={true}
                        />
                    ) : isManager ? (
                        <CreateUserButton
                            key={`manager-${currentUser.id}-${currentUser.branch_id}`}
                            isDisabled={currentUser.branch_id == null}
                            company_id={currentUser.company_id}
                            branch_id={currentUser.branch_id}
                            showBranchSelect={false}
                            managerExists={true}
                            isAdmin={false}
                        />
                    ) : null
                )
            }
        </div>
    );
};

export default PageHeader;

const Skeleton = () => {
    return (
        <div className="flex gap-2 justify-between items-center">
            <div className="flex flex-col gap-2 w-full">
                <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-8 w-full max-w-xs animate-pulse"/>

                <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-7 w-full max-w-sm animate-pulse"/>
            </div>

            <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-10 w-40 animate-pulse"/>
        </div>
    )
}