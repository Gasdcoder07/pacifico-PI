"use client";

import { motion } from "framer-motion";
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
        <div className="flex items-center gap-1 p-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-slate-800 backdrop-blur border border-neutral-200 dark:border-slate-700 shadow-sm">
            {(["es", "en"] as const).map((l) => (
                <motion.button
                    key={l}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    type="button"
                    onClick={() => change(l)}
                    className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                        locale === l
                            ? "bg-cyan-600 dark:bg-cyan-700 text-white"
                            : "text-neutral-600 hover:bg-neutral-100 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    }`}
                >
                    {l.toUpperCase()}
                </motion.button>
            ))}
        </div>
    );
};