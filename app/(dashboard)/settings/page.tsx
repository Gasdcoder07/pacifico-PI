import CompanyFormContainer from "@/features/settings/components/CompanyFormContainer";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
    title: "Pacífico - Empresa",
    description: "Gestiona tu empresa",
};

const Page = () => {
  const t = useTranslations("SettingsPage");

  return (
    <section className="flex w-full flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("header.title")}
        </h1>
        <p className="text-sm text-neutral-600">
          {t("header.subtitle")}
        </p>
      </div>

      <CompanyFormContainer />
    </section>
  );
};

export default Page;