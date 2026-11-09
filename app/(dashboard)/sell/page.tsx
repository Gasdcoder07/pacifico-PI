import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SellLayout from "@/features/sell/components/SellLayout";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");
    return { title: t("sell") };
}

const Page = () => {
    return (
        <SellLayout/>
    )
};

export default Page;