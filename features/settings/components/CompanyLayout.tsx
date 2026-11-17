"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../services/company.service";
import { useTranslations } from "next-intl";
import CompanyFormContainer from "./CompanyFormContainer";

const CompanyLayout = () => {
    const { user } = useAuth();
    const companyId = user?.company_id;

    const { data: company, isPending } = useQuery({
        queryKey: ["getCompany"],
        queryFn: () => {
            if (companyId === undefined || companyId === null) {
                throw new Error("Company ID is required");
            }

            return getCompanyById(companyId);
        },
        enabled: !!companyId
    });

    return (
        <section className="flex w-full flex-col gap-6 p-8">
            <PageHeader
                isLoading={isPending}/>

            <CompanyFormContainer
                isLoading={isPending}
                company={company}/>
        </section>
    );
};

export default CompanyLayout;

const PageHeader = ({ isLoading } : { isLoading : boolean}) => {
    const t = useTranslations("SettingsPage");

    if (isLoading) return <HeaderSkeleton/>

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
                {t("header.title")}
            </h1>
            
            <p className="text-sm text-neutral-600 dark:text-slate-400">
                {t("header.subtitle")}
            </p>
        </div>
    )
}

const HeaderSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-10 max-w-xs animate-pulse"/>

            <div className="bg-neutral-200 dark:bg-slate-800 rounded-md h-9 max-w-md animate-pulse"/>
        </div>
    )
}