"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTranslations } from "next-intl";

const PageHeader = () => {
    const t = useTranslations("UsersPage");
    const { user: currentUser } = useAuth();

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">{t("title")}</h3>
            <p className="text-sm text-neutral-500">{currentUser?.rol_id === 2 ? t("subtitleManager") : t("subtitleAdmin")}</p>
        </div>
    );
};

export default PageHeader;
