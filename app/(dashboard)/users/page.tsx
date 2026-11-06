import PageHeader from "@/features/users/components/PageHeader";
import UsersContainer from "@/features/users/components/UsersContainer";

const Page = () => {
  const t = useTranslations("UsersPage");

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden px-10 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">{t("title")}</h3>
        <p className="text-sm text-neutral-500 dark:text-[#8493A8]">{t("subtitle")}</p>
      </div>

      <PageHeader />
      <UsersContainer />
    </section>
  );
};

export default Page;
