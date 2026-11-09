import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import BranchesStats from "@/features/branches/components/BranchesStats";
import BranchesContainer from "@/features/branches/components/BranchesContainer";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("branches"),
    };
}

export default function BranchesPage() {
    return (
        <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
            <BranchesStats />
            <BranchesContainer />
        </div>
    );
}