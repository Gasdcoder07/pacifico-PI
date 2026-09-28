import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";

interface EditUserPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditUserPanel = ({ isOpen, onClose } : EditUserPanelProps) => {
    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title="Editar usuario">
            <div className="flex-1 flex flex-col justify-between min-h-0 h-full">
                <div className="flex-1 flex flex-col min-h-0 h-full p-6 gap-4">
                    <form className="flex flex-col gap-4">
                        <span className="text-[10px] text-neutral-400 uppercase font-medium">Datos generales</span>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-neutral-600">Nombre</label>
                                <input 
                                    type="text"
                                    name="username"
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-neutral-600">Apellido</label>
                                <input 
                                    type="text"
                                    name="username"
                                    className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">Nombre de usuario</label>
                            <input 
                                type="text"
                                name="username"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>

                        <span className="mt-2 text-[10px] text-neutral-400 uppercase font-medium">Credenciales</span>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">Correo electrónico</label>
                            <input 
                                type="email"
                                name="username"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600">Nueva contraseña</label>
                            <input 
                                type="password"
                                name="username"
                                className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </form>
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
            </div>
        </SlideOverPanelLayout>
    )
};

export default EditUserPanel;
