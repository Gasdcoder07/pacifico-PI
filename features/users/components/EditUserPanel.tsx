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
    const t = useTranslations();

    const [formData, setFormData] = useState({
        name: user.name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        rol_id: String(user.rol_id),
        branchId:  branchId
    });

    const customOptions = managerExists && Number(user.rol_id) !== 2 ? [{ value: "3", label: "Cajero" }] : [{ value: "2", label: "Gerente" }, { value: "3", label: "Cajero" }];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { mutate: mutateUpdateUser, isPending } = useMutation({
        mutationFn: (data: EditUserPayload) => updateUser(user.id, data),

        onSuccess: async () => {
            // toast.success(t("generalData.notifications.success"))
            toast.success("Si");

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["getBranch", Number(branchId)] }),
                queryClient.invalidateQueries({ queryKey: ["branches"] }),
            ]);

            onClose()
        },

        onError: async (e) => {
            // toast.error(t("generalData.notifications.error"));
            toast.error("No")
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
            toast.error("Pendejo");
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
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">Datos generales</span>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">Nombre</label>
                            <input
                                onChange={handleChange}
                                value={formData.name}
                                type="text"
                                name="name"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">Apellido</label>
                            <input 
                                onChange={handleChange}
                                value={formData.last_name}
                                type="text"
                                name="last_name"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>

                    <span className="mt-2 text-[10px] text-neutral-400 uppercase font-medium">Credenciales</span>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">Correo electrónico</label>
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
                        label="Rol *"
                        placeholder="Selecciona un rol"
                        options={customOptions}
                        value={String(formData.rol_id)}
                        onChange={(value) => setFormData({ ...formData, rol_id: value })}
                    />
                </div>

                <div className="border-t border-neutral-200 flex justify-end items-center gap-4 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-cyan-400 text-white font-medium hover:bg-cyan-500 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </SlideOverPanelLayout>
    )
};

export default EditUserPanel;
