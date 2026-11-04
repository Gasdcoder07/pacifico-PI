"use client";

import { motion } from "framer-motion";
import { ShoppingBasket, PackagePlus } from "lucide-react";

import { useTranslations } from "next-intl";
import Link from "next/link";

const MotionLink = motion.create(Link);

const EmptyState = () => {
    const t = useTranslations("SellPage.emptyState");

    return (
        <div className="flex flex-1 flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
                <div className="rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600">
                    <ShoppingBasket size={28} />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-xl font-semibold tracking-wide">
                        {t("title")}
                    </h3>
                    <p className="max-w-md text-sm text-neutral-600">
                        {t("description")}
                    </p>
                </div>
                <MotionLink
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.2,
                        ease: "easeInOut",
                    }}
                    aria-label={t("ariaLabel")}
                    title={t("ariaLabel")}
                    href="/inventory"
                    className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white"
                >
                    <PackagePlus size={17} />
                    {t("action")}
                </MotionLink>
            </div>
        </div>
    );
};

export default EmptyState;