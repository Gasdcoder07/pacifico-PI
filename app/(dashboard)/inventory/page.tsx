// app/dashboard/inventory/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import InventoryLayout from "@/features/inventory/components/InventoryLayout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("inventory"),
  };
}

const Page = () => {
  return <InventoryLayout />;
};

export default Page;