import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CompanyLayout from "@/features/settings/components/CompanyLayout";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("settings"),
    };
}

const Page = () => {
    return (
        <CompanyLayout/>
    );
};

export default Page;
