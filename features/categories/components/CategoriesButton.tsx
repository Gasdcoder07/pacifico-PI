"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tags, ChevronRight } from "lucide-react";

import { useTranslations } from "next-intl";
import CategoriesPanel from "./CategoriesPanel";

export const CategoryButton = () => {
    const t = useTranslations("InventoryPage.categoriesButton");
    const [showCategories, setShowCategories] = useState(false);

    return (
        <>
            <motion.button
                type="button"
                onClick={() => setShowCategories(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    duration: 0.2,
                    ease: "easeInOut",
                }}
                aria-label={t("label")}
                aria-expanded={showCategories}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800"
            >
                <Tags
                    size={20}
                    className="shrink-0 text-cyan-400 dark:text-cyan-500"
                />

                <span>{t("label")}</span>

                <span className="ml-1 flex items-center border-l border-neutral-200 pl-3 dark:border-slate-700">
                    <ChevronRight
                        size={16}
                        className="shrink-0 text-slate-500 dark:text-slate-400"
                    />
                </span>
            </motion.button>

            {
                showCategories && (
                    <CategoriesPanel
                        isOpen={showCategories}
                        onClose={() => setShowCategories(false)}/>
                )
            }
        </>
    );
};

export default CategoryButton;
