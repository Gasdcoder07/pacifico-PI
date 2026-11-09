import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SalesLayout from "@/features/sales/components/SalesLayout";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("sales"),
    };
}

export default function SalesPage() {
    return (
        <SalesLayout/>
    );
}