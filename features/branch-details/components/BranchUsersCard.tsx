"use client";

import "blobatar/motion.css";
import { Mail, ShieldCheck } from "lucide-react";
import { Blobatar } from "blobatar/react";
import { useTranslations } from "next-intl";

import { BranchId } from "@/features/branches/types/branch";
import { User } from "@/features/users/types/user";
import UserDropdownActionButton from "@/features/users/components/UserDropdownActionButton";

const BranchUsersCard = ({
    user,
    branchId,
}: {
    user: User;
    branchId: BranchId;
}) => {
    const t = useTranslations("UsersPage.card");

    return (
        <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-neutral-900 dark:text-white px-8 py-4 shadow-sm">
            <div className="flex items-center gap-4 min-w-3/10">
                <Blobatar
                    name={user.name + " " + user.last_name}
                    animate="always"
                    className="flex size-12 items-center justify-center rounded-full"
                />

                <p className="font-medium text-[15px] text-neutral-900 dark:text-white">
                    {user.name} {user.last_name}
                </p>
            </div>

            <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
                <div className="flex flex-1 min-w-0 flex-col gap-2">
                    <div>
                        <RolSpan rol_id={user.rol_id} />
                    </div>

                    <div className="flex flex-1 min-w-0 items-center gap-2">
                        <Mail
                            size={14}
                            className="translate-y-[0.5px] shrink-0 text-neutral-500 dark:text-slate-400"
                        />
                        <span className="truncate text-xs text-neutral-500 dark:text-slate-400">
                            {user.email}
                        </span>
                    </div>
                </div>

                <UserDropdownActionButton
                    user={user}
                    branchId={branchId}
                    isAdminView={false}
                />
            </div>
        </div>
    );
};

export default BranchUsersCard;

interface RolSpanProps {
    rol_id: number | string;
}

export const RolSpan = ({ rol_id }: RolSpanProps) => {
    const t = useTranslations("UsersPage.roles");
    let label = "";
    let spanStyles = "";

    if (String(rol_id) === "1") {
        label = t("admin");
        spanStyles =
            "bg-[#EDE9FE] text-[#5B21B6] border-purple-200 dark:bg-slate-950 dark:text-purple-400 dark:border-purple-900";
    } else if (String(rol_id) === "2") {
        label = t("manager");
        spanStyles =
            "bg-[#DBEAFE] text-[#1E40AF] border-blue-200 dark:bg-slate-950 dark:text-blue-400 dark:border-blue-900";
    } else {
        label = t("cashier");
        spanStyles =
            "bg-[#CCFBF1] text-[#0F766E] border-teal-200 dark:bg-slate-950 dark:text-teal-400 dark:border-teal-900";
    }

    return (
        <span
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1 text-xs ${spanStyles}`}
        >
            <ShieldCheck size={14} className="shrink-0" />
            {label}
        </span>
    );
};
