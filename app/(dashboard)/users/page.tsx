import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import UsersLayout from "@/features/users/components/UsersLayout";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");
    return { title: t("users") };
}

const Page = () => {
    return (
        <UsersLayout/>
    )
};

export default Page;