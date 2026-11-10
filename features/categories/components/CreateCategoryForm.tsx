"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createCategory } from "../services/category.service";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const buttonStyles = "shrink-0 flex cursor-pointer justify-center items-center gap-2 rounded-lg bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:bg-neutral-600 disabled:dark:bg-slate-700 disabled:dark:text-slate-500 disabled:cursor-not-allowed"

const inputStyles = "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-lg focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none";

const initialForm = {
    name: "",
    description: ""
};

const CreateCategoryForm = () => {
    const t = useTranslations("InventoryPage.categoriesPanel.createForm");
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState(initialForm);

    const { mutate: mutateCreateCategory, isPending } = useMutation({
        mutationFn: createCategory,

        onSuccess: async () => {
            toast.success(t("notifications.success"));

            setFormData(initialForm);

            void queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: async (e) => {
            toast.error(t("notifications.error"));
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending) return;

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            toast.error(t("notifications.requiredName"));
            return;
        }

        mutateCreateCategory({
            name,
            description: description || null
        });
    };

    return (
        <div className="p-6 pb-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4 bg-white w-full rounded-lg border border-neutral-200 dark:bg-none dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-slate-950 dark:text-slate-100">{t("title")}</h3>
                        <p className="font-medium text-neutral-600 dark:text-slate-400 text-sm">{t("subtitle")}</p>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={!isPending ? { scale: 1.02 } : undefined}
                        whileTap={!isPending ? { scale: 0.9 } : undefined}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                        className={`${buttonStyles}`}>
                        <span>
                            {isPending ? t("creatingButton") : t("createButton")}
                        </span>
                    </motion.button>
                </div>
                {/* Inputs */}
                <div className="w-full grid grid-cols-2 gap-4 text-neutral-600 dark:text-slate-400 text-sm">
                    <div className="min-w-0">
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isPending}
                            maxLength={100}
                            className={`${inputStyles}`}
                            aria-label={t("namePlaceholder")}
                            placeholder={t("namePlaceholder")}/>
                    </div>

                    <div className="min-w-0">
                        <input
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isPending}
                            className={`${inputStyles}`}
                            aria-label={t("descriptionPlaceholder")}
                            placeholder={t("descriptionPlaceholder")}/>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default CreateCategoryForm;