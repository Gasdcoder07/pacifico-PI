import { UserProfile } from "@/features/auth/types/authInterfaces";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
    currentUser?: UserProfile | null;
}

const PageHeader = ({ currentUser }: PageHeaderProps) => {
    const t = useTranslations("SalesPage");
    const isAdmin = currentUser?.rol_id === 1;

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">{t("title")}</h3>
            <p className="text-sm text-neutral-500 dark:text-[#8493A8]">{isAdmin ? t("history.subtitleAdmin") : t("history.subtitleManager")}</p>
        </div>
    );
};

export default PageHeader;
