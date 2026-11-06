import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

import RegisterForm from "@/features/auth/components/RegisterForm";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Register");
    return {
        title: `Pacífico - ${t("title")}`,
        description: t("subtitle"),
    };
}

const page = async () => {
    const t = await getTranslations("Register");

    return (
        <div className="w-full h-full flex">
            <div className="relative hidden md:flex w-1/2 overflow-hidden rounded-xl">
                <Image
                    src="/auth_image.webp"
                    alt="Auth Image"
                    fill
                    className="object-cover"
                    priority
                    quality={75}/>

                <div className="absolute top-1/2 -translate-y-1/2 right-6 lg:right-12 text-right text-white p-2 flex flex-col gap-2">
                    <h3 className="text-3xl leading-relaxed font-semibold">{t("title")}</h3>

                    <p className="max-w-2xl leading-relaxed font-light">{t("subtitle")}</p>
                </div>
            </div>

            <div className="relative w-full md:w-1/2 p-4 md:pl-8">
                <div className="max-w-md mx-auto h-full flex flex-col justify-center gap-6">
                    <Image
                        quality={80}
                        priority
                        width={1000}
                        height={1000}
                        src="/pacifico-logo.svg"
                        alt="Logo de Pacífico"
                        className="flex sm:hidden h-16 w-auto self-start object-contain -translate-x-1.5"/>

                    <Image
                        quality={80}
                        priority
                        width={1000}
                        height={1000}
                        src="/pacifico-logo-horizontal.svg"
                        alt="Logo de Pacífico"
                        className="hidden sm:flex h-16 w-auto self-start object-contain -translate-x-1.5"/>

                    <div className="text-left flex flex-col gap-2 w-full">
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-wide">{t("title")}</h3>

                        <p className="text-sm text-neutral-600 dark:text-slate-400 leading-relaxed">{t("title")}</p>
                    </div>

                    <RegisterForm/>
                </div>
            </div>
        </div>
    );
};

export default page;