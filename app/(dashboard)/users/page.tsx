"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const page = () => {
    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden px-12 py-10 gap-10">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Gestión de usuarios</h3>
                <p className="text-neutral-500 text-sm">Las personas que mantienen tu sucursal.</p>
            </div>

            <div className="flex flex-col gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        duration: 0.2,
                        ease: "easeInOut"
                    }}
                    className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer self-end">
                    <Plus size={20} className="shrink-0"/>
                    <span>Crear usuario</span>
                </motion.button>

                <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                            <td className="px-6 py-4 whitespace-nowrap">john.doe@example.com</td>
                            <td className="px-6 py-4 whitespace-nowrap">Administrador</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button className="text-blue-500 hover:text-blue-700">
                                        Editar
                                    </button>
                                    <button className="text-red-500 hover:text-red-700">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default page;
