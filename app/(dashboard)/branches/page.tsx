"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBranches } from "@/features/branches/services/branch.service";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";

export default function Page() {
    
    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches
    })

    const branches = data?.data

    const { user } = useAuth();

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="relative w-full lg:w-2/3 min-h-96 bg-linear-to-tr from-cyan-600/40 to-cyan-400 rounded-2xl border-2 border-cyan-50 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
                    <div className="absolute bg-linear-to-l from-cyan-50 to-cyan-50/20 w-56 h-56 -bottom-10 -right-10 blur-3xl animate-pulse pointer-events-none"/>
                    <div className="absolute bg-linear-to-l from-cyan-50 to-cyan-50/20 w-64 h-64 -top-10 -left-10 blur-3xl animate-pulse pointer-events-none"/>
                    <h1 className="relative z-10 text-white text-2xl sm:text-3xl lg:text-4xl font-bold my-4">
                        Sucursal con mejores ganancias
                    </h1>
                    <div className="relative z-10 w-full sm:w-[80%] backdrop-blur-3xl rounded-3xl p-6 sm:px-8 sm:py-12 shadow-2xl border border-white/20">
                        <h2 className="text-xl sm:text-2xl bg-clip-text text-transparent bg-linear-to-r from-zinc-50 to-cyan-50 mb-2">
                            Sucursal Manzanillo {user?.name ? `(${user.name})` : ""}
                        </h2>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-cyan-50">$128,000</h1>
                    </div>
                </div>
                
                <div className="relative w-full lg:w-1/3 bg-white/80 rounded-3xl p-6 sm:p-8 shadow-lg overflow-hidden flex flex-col justify-between">
                    <div className="absolute w-36 h-36 bg-zinc-600/50 top-15 right-10 blur-3xl animate-pulse pointer-events-none"/>
                    <h1 className="relative z-10 text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-zinc-700 to-zinc-500/30">Top 3</h1>
                    <ul className="relative z-10 ml-0 sm:ml-6 mt-6 sm:mt-10 flex flex-col gap-6 sm:gap-12 font-semibold text-zinc-500 backdrop-blur-3xl p-4 sm:p-2 sm:pt-8 rounded-2xl">
                        <li className="text-xl sm:text-2xl">Manzanillo</li>
                        <li className="text-xl sm:text-2xl">Tecomán</li>
                        <li className="text-xl sm:text-2xl">Guerrero</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-row gap-8">
                <div className="w-full bg-zinc-50 min-h-64 rounded-3xl shadow-xl p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-zinc-600 mb-6">Mis sucursales</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-150">
                            <thead>
                                <tr className="border-b border-zinc-300 text-zinc-500 text-sm font-semibold">
                                    <th className="pb-3 px-2">Nombre</th>
                                    <th className="pb-3 px-2">Dirección</th>
                                    <th className="pb-3 px-2">Teléfono</th>
                                    <th className="pb-3 px-2">Contacto</th>
                                    <th className="pb-3 px-2">Estado</th>
                                    <th className="pb-3 px-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-300 text-zinc-600 text-sm">
                                {branches.map((sucursal) => (
                                    <tr key={sucursal.id} className="hover:bg-zinc-300/50 transition-colors">
                                        <td className="py-4 px-2 font-semibold text-zinc-700">{sucursal.name}</td>
                                        <td className="py-4 px-2">{sucursal.direction || "—"}</td>
                                        <td className="py-4 px-2">{sucursal.phone || "—"}</td>
                                        <td className="py-4 px-2">{sucursal.contact_info || "—"}</td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${sucursal.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {sucursal.status ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-zinc-300 rounded-lg text-zinc-600 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-zinc-300 rounded-lg text-zinc-600 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}