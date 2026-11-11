"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import ProfilePfp from "@/shared/components/ProfilePfp";
import BusinessContext from "./BusinessContext";
import { LanguageSwitcher } from "@/i18n/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/shared/components/ThemeToggle";

const Navbar = () => {
    const t = useTranslations("Navbar");
    const { user, loading } = useAuth();
    const fullName = user ? `${user.name} ${user.last_name}` : t("loading");

    return (
        <nav className="bg-white text-neutral-900 border border-neutral-300 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-800">
            <div className="mx-auto flex justify-between items-center py-3 px-4">
                <BusinessContext
                    role={user?.rol_id}
                    companyImage={user?.company_image ? user.company_image : '/default_branch.webp'}
                    contextName={user?.context_name}
                    loading={loading}
                />

                <div className="flex justify-center items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <ProfilePfp
                        name={fullName || t("user")}
                        role={user?.rol_id || null}
                        avatar={user?.foto_url ? user.foto_url : "/default_profile.webp"}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;