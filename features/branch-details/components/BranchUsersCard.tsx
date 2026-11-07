"use client";

import "blobatar/motion.css";
import { BriefcaseBusiness, Mail, ScanBarcode } from "lucide-react";
import { Blobatar } from "blobatar/react";
import { useTranslations } from "next-intl";

import { BranchId } from "@/features/branches/types/branch";
import { User } from "@/features/users/types/user";
import UserDropdownActionButton from "@/features/users/components/UserDropdownActionButton";

interface BranchUsersCardProps {
    user: User;
    branchId: BranchId;
    isAdmin: boolean;
}

const BranchUsersCard = ({ user, branchId, isAdmin }: BranchUsersCardProps) => {
    const fullName = `${user.name} ${user.last_name}`;

    return (
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-4 rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow-sm text-neutral-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 sm:px-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_auto] lg:gap-x-0 lg:px-8">
            {/* Usuario */}
            <div className="col-span-2 flex min-w-0 items-center gap-4 lg:col-span-1">
                <div className="shrink-0">
                    <Blobatar
                        name={fullName}
                        animate="always"
                        className="flex size-12 items-center justify-center rounded-full"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p
                        title={fullName}
                        className="truncate text-[15px] font-medium"
                    >
                        {fullName}
                    </p>

                    <div className="min-w-0">
                        <RolSpan rol_id={user.rol_id} />
                    </div>
                </div>
            </div>

            {/* Correo electrónico */}
            <div className="flex min-w-0 items-center gap-2 lg:border-l lg:border-neutral-200 lg:px-4 dark:lg:border-slate-800">
                <Mail
                    size={14}
                    className="shrink-0 text-neutral-500 dark:text-slate-400"
                />

                <span
                    title={user.email}
                    className="block min-w-0 truncate text-xs text-neutral-500 dark:text-slate-400"
                >
                    {user.email}
                </span>
            </div>

            <div className="flex min-w-0 items-center justify-end lg:pl-4">
                <div className="shrink-0">
                    <UserDropdownActionButton
                        user={user}
                        branchId={branchId}
                        isAdminView={false}
                    />
                </div>
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
    let Icon = ScanBarcode;

    if (String(rol_id) === "1") {
        label = t("admin");
        spanStyles =
            "bg-[#EDE9FE] text-[#5B21B6] border-purple-200 dark:bg-slate-950 dark:text-purple-400 dark:border-purple-900";
    } else if (String(rol_id) === "2") {
        label = t("manager");
        Icon = BriefcaseBusiness;

        spanStyles =
            "bg-[#DBEAFE] text-[#1E40AF] border-blue-200 dark:bg-slate-950 dark:text-blue-400 dark:border-blue-900";
    } else {
        label = t("cashier");
        Icon = ScanBarcode;

        spanStyles =
            "bg-[#CCFBF1] text-[#0F766E] border-teal-200 dark:bg-slate-950 dark:text-teal-400 dark:border-teal-900";
    }

    return (
        <span
            className={`inline-flex max-w-full min-w-0 whitespace-nowrap items-center gap-2 rounded-full border px-4 py-1 text-xs ${spanStyles}`}
        >
            <Icon size={14} className="shrink-0" />

            <span className="min-w-0 truncate">
                {label}
            </span>
        </span>
    );
};