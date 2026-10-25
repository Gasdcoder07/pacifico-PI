"use client";

import CreateUserButton from "@/features/users/components/CreateUserButton";
import UsersContainer from "@/features/users/components/UsersContainer";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("UsersPage");

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden px-10 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">{t("title")}</h3>
        <p className="text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="flex flex-1 min-h-0 min-w-0 flex-col gap-4">
        <CreateUserButton 
          isDisabled={false} 
          branch_id={1} 
          company_id={1} 
        />
        <UsersContainer />
      </div>
    </section>
  );
};

export default Page;