import { getBranches } from "@/features/branches/services/branch.service";
import { CustomSelect } from "@/shared/components/CustomSelect";
import { ModalLayout } from "@/shared/components/ModalLayout";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });

    const branches = data ? data : [];

    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        role: "",
        sucursal_id: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    console.log(branches)

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title="Crear cuenta">
            <form className="flex flex-col gap-4 text-sm">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">Nombre *</label>
                        <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600">Apellido *</label>
                        <input 
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-neutral-600">Correo electrónico *</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-neutral-600">Contraseña *</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out"
                    />
                    <span className="text-xs text-neutral-500">
                        Mínimo 8 caracteres, un número y un carácter especial.
                    </span>
                </div>

                <div className="w-full flex gap-4">
                    <CustomSelect
                        isDisabled={false}
                        label="Rol *"
                        placeholder="Selecciona un rol"
                        options={[
                            { value: "2", label: "Gerente" },
                            { value: "3", label: "Cajero" }
                        ]}
                        value={formData.role}
                        onChange={(value) => setFormData({ ...formData, role: value })}
                    />

                    <CustomSelect
                        isDisabled={isLoading}
                        label="Sucursal *"
                        placeholder="Selecciona una sucursal"
                        options={branches.map((branch) => ({
                            value: String(branch.id),
                            label: branch.name,
                        }))}
                        value={formData.sucursal_id}
                        onChange={(value) => setFormData({ ...formData, sucursal_id: value })}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
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
                        Guardar cuenta
                    </button>
                </div>
            </form>
        </ModalLayout>
    );
};