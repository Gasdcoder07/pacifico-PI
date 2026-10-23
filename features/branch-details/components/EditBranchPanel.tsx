import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";
import { ImagePlus } from "lucide-react";

interface EditBranchPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditBranchPanel = ({ isOpen, onClose }: EditBranchPanelProps) => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title="Editar sucursal">
            <div className="flex-1 flex flex-col justify-between min-h-0 h-full">
                <div className={`flex-1 flex flex-col min-h-0 h-full p-6 gap-4 overflow-y-auto ${scrollbarStyles}`}>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">Datos generales</span>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">Foto de la sucursal</label>
                        <div className="flex items-center gap-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-4">
                            <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400">
                                <ImagePlus size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-neutral-600">Foto de la sucursal</span>
                                <span className="text-xs text-neutral-400">Sin foto seleccionada</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-name" className="font-medium text-neutral-600">Nombre de la sucursal</label>
                        <input
                            id="branch-name"
                            type="text"
                            placeholder="Nombre de la sucursal"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-address" className="font-medium text-neutral-600">Dirección</label>
                        <textarea
                            id="branch-address"
                            placeholder="Dirección de la sucursal"
                            rows={3}
                            className="w-full min-h-24 resize-y p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-phone" className="font-medium text-neutral-600">Número de teléfono de contacto</label>
                        <input
                            id="branch-phone"
                            type="tel"
                            placeholder="Número de teléfono"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="branch-email" className="font-medium text-neutral-600">Correo electrónico de la sucursal</label>
                        <input
                            id="branch-email"
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>
                </div>

                <div className="border-t border-neutral-200 flex justify-end items-center gap-4 p-6">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-cyan-400 text-white font-medium hover:bg-cyan-500 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        Guardar sucursal
                    </button>
                </div>
            </div>
        </SlideOverPanelLayout>
    );
};

export default EditBranchPanel;
