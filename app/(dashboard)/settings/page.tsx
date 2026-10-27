import CompanyForm from "@/features/settings/CompanyForm";
import { useTranslations } from "next-intl";

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

      <CompanyForm />
    </section>
  );
};

export default Page;