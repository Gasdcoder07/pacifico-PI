import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("dashboard"),
    };
}

const Page = () => {
    return <DashboardLayout />;
};

export default Page;