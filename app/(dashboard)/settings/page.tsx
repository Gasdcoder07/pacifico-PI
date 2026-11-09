import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import CompanyFormContainer from "@/features/settings/components/CompanyFormContainer";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("settings"),
    };
}

const Page = () => {
    const t = useTranslations("SettingsPage");

    return (
        <section className="flex w-full flex-col gap-6 p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("header.title")}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-slate-400">
                    {t("header.subtitle")}
                </p>
            </div>

            <CompanyFormContainer />
        </section>
    );
};

export default Page;
