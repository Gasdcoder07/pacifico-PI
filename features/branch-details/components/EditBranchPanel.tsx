import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Branch, EditBranchPayload } from "@/features/branches/types/branch";
import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";

import { ImagePlus } from "lucide-react";
import { updateBranch } from "@/features/branches/services/branch.service";
import { useTranslations } from "next-intl";

interface EditBranchPanelProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
}

const EditBranchPanel = ({ isOpen, onClose, branch }: EditBranchPanelProps) => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const t = useTranslations("BranchDetails.editBranchModal");
    const queryClient = useQueryClient();

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        name: branch?.name,
        adress: branch?.direction,
        phone: branch?.phone,
        contact_info: branch?.contact_info,
        foto_url: branch?.foto_url,
        status: branch?.status,
    })

    const [imagePreview, setImagePreview] = useState(
        branch?.foto_url ?? ""
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

    e.currentTarget.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
        // toast.error(t("notifications.invalidImageFormat"));
        toast.error("Nel");
        e.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        toast.error("nel");
        e.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
        if (typeof reader.result !== "string") return;

        const imageUrl = reader.result;

        setImagePreview(imageUrl);

        setFormData((prev) => ({
            ...prev,
            foto_url: imageUrl
        }))
    };
        reader.readAsDataURL(file);
    };

    const { mutate: mutateUpdateBranch, isPending } = useMutation({
        mutationFn: (data: EditBranchPayload) => updateBranch(branch!.id, data),

        onSuccess: async () => {
            toast.success(t("generalData.notifications.success"))

            await queryClient.invalidateQueries({ queryKey: ["getBranch", branch?.id] });

            onClose()
        },

        onError: async (e) => {
            toast.error(t("generalData.notifications.error"));
            console.log(e);
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const name = formData.name?.trim();
        const adress = formData.adress?.trim();
        const phone = formData.phone?.trim();
        const contact_info = formData.contact_info?.trim();
        const imageUrl = formData.foto_url;
        const status = formData.status;

        if (!name || !adress) {
            toast.error(t("generalData.notifications.requiredFields"));
            return;
        }

        mutateUpdateBranch({
            nombre: name,
            direccion: adress,
            telefono: phone,
            info_contacto: contact_info,
            foto_url: imageUrl,
            estado: status,
        });
    }

    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title={t("title")}>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 h-full">
                <div className={`flex-1 flex flex-col min-h-0 h-full p-6 gap-4 overflow-y-auto ${scrollbarStyles}`}>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">{t("generalData.title")}</span>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">{t("generalData.fields.photo")}</label>
                        <div className="relative flex items-center gap-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-4 h-32 overflow-hidden">
                            {
                                imagePreview ? (
                                    <img
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={imagePreview}
                                        alt={formData.name || ""}/>
                                ) : (
                                    <>
                                        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400">
                                            <ImagePlus size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-neutral-600">{t("generalData.fields.photo")}</span>
                                            <span className="text-xs text-neutral-400">{t("generalData.noPhoto")}</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                className="text-sm font-medium text-cyan-600 hover:text-cyan-700 cursor-pointer duration-200 ease-in-out transition-all"
                            >
                                {imagePreview ? t("generalData.changeButton") : t("generalData.uploadButton")}
                            </button>
                            <span className="text-xs text-neutral-400 text-center">
                                {t("generalData.requirements")}
                            </span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png"
                            className="hidden"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-name" className="font-medium text-neutral-600">{t("generalData.fields.name")}</label>
                        <input
                            id="branch-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nombre de la sucursal"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-address" className="font-medium text-neutral-600">{t("generalData.fields.address")}</label>
                        <textarea
                            id="branch-address"
                            name="adress"
                            value={formData.adress}
                            onChange={handleInputChange}
                            placeholder="Dirección de la sucursal"
                            rows={3}
                            className="w-full min-h-24 resize-y p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-phone" className="font-medium text-neutral-600">{t("generalData.fields.contact")}</label>
                        <input
                            id="branch-phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Número de teléfono"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-email" className="font-medium text-neutral-600">{t("generalData.fields.email")}</label>
                        <input
                            id="branch-email"
                            type="email"
                            name="contact_info"
                            onChange={handleInputChange}
                            value={formData.contact_info}
                            placeholder="Correo electrónico"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>
                </div>

                <div className="border-t border-neutral-200 flex justify-end items-center gap-4 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
                    >
                        {t("generalData.actions.cancel")}
                    </button>

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${isPending
                            ? 'bg-neutral-600 cursor-not-allowed'
                            : 'bg-cyan-400 hover:bg-cyan-500 cursor-pointer'
                        }`}
                    >
                        {isPending ? t("generalData.actions.submitting") : t("generalData.actions.submit")}
                    </button>
                </div>
            </form>
        </SlideOverPanelLayout>
    );
};

export default EditBranchPanel;
