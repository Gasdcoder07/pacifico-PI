import LandingPage from "@/features/landing/components/LandingPage";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: { absolute: t("home") },
        description: t("homeDescription"),
    };
}

export default function Home() {
    return <LandingPage />;
}
