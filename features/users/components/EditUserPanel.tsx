import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";
import { CustomSelect } from "@/shared/components/CustomSelect";

import { EditUserPayload, User } from "../types/user";
import { updateUser } from "../services/users.service";

interface EditUserPanelProps {
    user: User;
    managerExists: boolean
    branchId: number | undefined;
    isOpen: boolean;
    onClose: () => void;
}

const EditUserPanel = ({ isOpen, onClose, user, managerExists, branchId } : EditUserPanelProps) => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const queryClient = useQueryClient();
    const t = useTranslations("BranchDetails.usersContainer.editUserPanel");

    const [formData, setFormData] = useState({
        name: user.name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        rol_id: String(user.rol_id),
        branchId:  branchId
    });

    const customOptions = managerExists && Number(user.rol_id) !== 2 ? [{ value: "3", label: t("roles.cashier") }] : [{ value: "2", label: t("roles.manager") }, { value: "3", label: t("roles.cashier") }];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { mutate: mutateUpdateUser, isPending } = useMutation({
        mutationFn: (data: EditUserPayload) => updateUser(user.id, data),

        onSuccess: async () => {
            toast.success(t("notifications.success"))

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["getBranch", Number(branchId)] }),
                queryClient.invalidateQueries({ queryKey: ["branches"] }),
            ]);

            onClose()
        },

        onError: async (e) => {
            toast.error(t("notifications.error"));
            console.log(e);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const name = formData.name.trim();
        const last_name = formData.last_name.trim();
        const email = formData.email.trim();
        const rol_id = Number(formData.rol_id)

        if (!name || !last_name || !email) {
            toast.error(t("notifications.requiredFields"));
            return;
        }

        mutateUpdateUser({
            name: name,
            last_name: last_name,
            email: email,
            rol_id: rol_id
        });
    }

    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title="Editar usuario">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 h-full">
                <div className={`flex-1 flex flex-col min-h-0 h-full p-6 gap-4 overflow-y-auto ${scrollbarStyles}`}>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">{t("generalData")}</span>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">{t("fields.name")}</label>
                            <input
                                onChange={handleChange}
                                value={formData.name}
                                type="text"
                                name="name"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">{t("fields.lastName")}</label>
                            <input 
                                onChange={handleChange}
                                value={formData.last_name}
                                type="text"
                                name="last_name"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>

                    <span className="mt-2 text-[10px] text-neutral-400 uppercase font-medium">{t("credentials")}</span>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">{t("fields.email")}</label>
                        <input
                            onChange={handleChange}
                            value={formData.email}
                            type="email"
                            name="email"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <CustomSelect
                        isDisabled={false}
                        label={t("fields.role")}
                        placeholder="Selecciona un rol"
                        options={customOptions}
                        value={String(formData.rol_id)}
                        onChange={(value) => setFormData({ ...formData, rol_id: value })}
                    />
                </div>

                <div className="border-t border-neutral-200 flex justify-end items-center gap-4 p-6">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 transition-colors ease-in-out duration-200 ${isPending
                            ? 'cursor-not-allowed'
                            : 'hover:bg-neutral-50 cursor-pointer'
                        }`}
                    >
                        {t("actions.cancel")}
                    </button>
                    <button
                        disabled={isPending}
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${isPending
                            ? 'bg-neutral-600 cursor-not-allowed' 
                            : 'bg-cyan-400 hover:bg-cyan-500 cursor-pointer'}`}
                    >
                        {isPending ? t("actions.submitting") : t("actions.submit")}   
                    </button>
                </div>
            </form>
        </SlideOverPanelLayout>
    )
};

export default EditUserPanel;
