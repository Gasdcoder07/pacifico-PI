import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";
import { UserProfile } from "@/features/auth/types/authInterfaces";
import { updateProfile } from "@/features/users/services/users.service";
import { UpdateProfileRequest } from "@/features/users/types/user";

interface EditUserPanelProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-600";

const EditProfilePanel = ({ isOpen, onClose, user } : EditUserPanelProps) => {
    const queryClient = useQueryClient();
    const t = useTranslations("ProfilePfp.editProfilePanel");

    const [formData, setFormData] = useState({
        name: user.name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { mutate: mutateUpdateUser, isPending } = useMutation({
        mutationFn: (data: UpdateProfileRequest) => updateProfile(user.id, data),

        onSuccess: async (response) => {
            const updatedUser = response.data;

            queryClient.setQueryData<UserProfile>(
                ["authUser"],
                (currentUser) => {
                    if (!currentUser) return currentUser;

                    return {
                        ...currentUser,
                        name: updatedUser.name,
                        last_name: updatedUser.last_name,
                        email: updatedUser.email,
                    };
                }
            );
            
            toast.success(t("notifications.success"))

            await queryClient.invalidateQueries({ queryKey: ["getSales"] }),
            
            onClose()
        },

        onError: async (e) => {
            toast.error(t("notifications.error"));
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const name = formData.name.trim();
        const last_name = formData.last_name.trim();
        const email = formData.email.trim();

        if (!name || !last_name || !email) {
            toast.error(t("notifications.requiredFields"));
            return;
        }

        mutateUpdateUser({
            name: name,
            last_name: last_name,
            email: email
        });
    }

    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title={t("title")}>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 h-full">
                <div className={`flex-1 flex flex-col min-h-0 h-full p-6 gap-4 overflow-y-auto ${scrollbarStyles}`}>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-400 uppercase font-medium">{t("generalData")}</span>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600 dark:text-slate-400">{t("fields.name")}</label>
                            <input
                                onChange={handleChange}
                                value={formData.name}
                                type="text"
                                name="name"
                                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600 dark:text-slate-400">{t("fields.lastName")}</label>
                            <input 
                                onChange={handleChange}
                                value={formData.last_name}
                                type="text"
                                name="last_name"
                                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>

                    {/* <span className="mt-2 text-[10px] text-neutral-400 dark:text-slate-400 uppercase font-medium">{t("credentials")}</span>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600 dark:text-slate-400">{t("fields.email")}</label>
                        <input
                            onChange={handleChange}
                            value={formData.email}
                            type="email"
                            name="email"
                            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div> */}
                </div>

                <div className="border-t border-neutral-200 dark:border-slate-800 flex justify-end items-center gap-4 p-6">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 transition-colors ease-in-out duration-200 ${isPending
                            ? 'cursor-not-allowed'
                            : 'hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer'
                        }`}
                    >
                        {t("actions.cancel")}
                    </button>
                    <button
                        disabled={isPending}
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${isPending
                            ? 'bg-neutral-600 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed' 
                            : 'bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 hover:bg-cyan-500 cursor-pointer'}`}
                    >
                        {isPending ? t("actions.submitting") : t("actions.submit")}   
                    </button>
                </div>
            </form>
        </SlideOverPanelLayout>
    )
};

export default EditProfilePanel;
