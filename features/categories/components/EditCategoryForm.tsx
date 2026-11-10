"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { Category } from "@/features/inventory/services/inventory.service";

interface EditCategoryFormProps {
    category: Category;
}

interface EditCategoryPayload {
    name: string;
    description: string | null;
}

const inputStyles =
    "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-lg focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none";

const buttonStyles =
    "flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm";

const EditCategoryForm = ({ category }: EditCategoryFormProps) => {
    const t = useTranslations("InventoryPage.categoriesPanel.editForm");

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description ?? "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setFormData({
            name: category.name,
            description: category.description ?? "",
        });

        setIsEditing(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            toast.error(t("notifications.requiredName"));
            return;
        }

        const payload: EditCategoryPayload = {
            name,
            description: description || null,
        };

        console.log("CATEGORY ID:", category.id);
        console.log("EDIT CATEGORY PAYLOAD:", payload);
    };

    return (
        <motion.div
            layout
            transition={{
                layout: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                },
            }}
            className="flex w-full min-w-0 shrink-0 flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex min-w-0 items-center justify-between gap-4">
                <h3 className="min-w-0 truncate font-semibold text-slate-950 dark:text-slate-100">
                    {category.name}
                </h3>

                <motion.button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    aria-label={t("editButton")}
                    title={t("editButton")}
                    whileHover={!isEditing ? { scale: 1.05 } : undefined}
                    whileTap={!isEditing ? { scale: 0.9 } : undefined}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 disabled:cursor-default disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400"
                >
                    <Pencil size={16} />
                </motion.button>
            </div>

            <AnimatePresence initial={false}>
                {isEditing && (
                    <motion.form
                        key="edit-category-form"
                        onSubmit={handleSubmit}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.25,
                            ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 flex flex-col gap-4 border-t border-neutral-200 pt-4 dark:border-slate-800">
                            <div className="grid w-full grid-cols-1 gap-4 text-sm text-neutral-600 sm:grid-cols-2 dark:text-slate-400">
                                <div className="min-w-0">
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        maxLength={100}
                                        required
                                        aria-label={t("nameLabel")}
                                        placeholder={t("namePlaceholder")}
                                        className={inputStyles}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <input
                                        name="description"
                                        type="text"
                                        value={formData.description}
                                        onChange={handleChange}
                                        aria-label={t("descriptionLabel")}
                                        placeholder={t(
                                            "descriptionPlaceholder",
                                        )}
                                        className={inputStyles}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <motion.button
                                    type="button"
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {t("cancelButton")}
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={buttonStyles}
                                >
                                    <Check size={16} className="shrink-0" />
                                    <span>{t("saveButton")}</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EditCategoryForm;
