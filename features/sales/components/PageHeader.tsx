import { UserProfile } from "@/features/auth/types/authInterfaces";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
    currentUser?: UserProfile | null;
    isLoading: boolean;
}

const PageHeader = ({ currentUser, isLoading }: PageHeaderProps) => {
    const t = useTranslations("SalesPage");
    const isAdmin = currentUser?.rol_id === 1;

    if (isLoading) return <Skeleton/>

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">{t("title")}</h3>
            <p className="text-sm text-neutral-500 dark:text-[#8493A8]">{isAdmin ? t("history.subtitleAdmin") : t("history.subtitleManager")}</p>
        </div>
    );
};

export default PageHeader;

const Skeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-10 max-w-xs animate-pulse"/>

            <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-9 max-w-md animate-pulse"/>
        </div>
    )
}