"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { setLocale } from "@/i18n/actions";

export const LanguageSwitcher = () => {
    const router = useRouter();
    const locale = useLocale();

    const change = async (newLocale: "es" | "en") => {
        if (newLocale === locale) return;
        await setLocale(newLocale);
        router.refresh();
    };

    return (
        <div className="flex gap-1 text-sm">
            {(["es", "en"] as const).map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => change(l)}
                    className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                        locale === l
                            ? "bg-cyan-600 text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
};