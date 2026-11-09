// app/dashboard/sales/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SalesClientPage from "./SalesClientPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("sales"),
  };
}

export default function Page() {
  return <SalesClientPage />;
}