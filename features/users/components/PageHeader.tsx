"use client";

import CreateUserButton from "./CreateUserButton";

import { useTranslations } from "next-intl";
import { UserProfile } from "@/features/auth/types/authInterfaces";

interface PageHeaderProps {
    currentUser?: UserProfile | null;
}

const PageHeader = ({ currentUser } : PageHeaderProps) => {
    const t = useTranslations("UsersPage");

    return (
        <div className="flex gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">{t("title")}</h3>
                <p className="text-sm text-neutral-500">{currentUser?.rol_id === 2 ? t("subtitleManager") : t("subtitleAdmin")}</p>
            </div>

            {
                currentUser?.rol_id === 1 ?
                (
                    <CreateUserButton
                        isDisabled={false}
                        company_id={currentUser.company_id}
                        showBranchSelect={true}
                        />
                ) : (
                    <CreateUserButton
                        isDisabled={false}
                        company_id={currentUser?.company_id}
                        branch_id={currentUser?.sucursal_id}
                        showBranchSelect={false}
                        managerExists={true}
                        />
                )
            }
        </div>
    );
};

export default PageHeader;
