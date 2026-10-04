"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import BranchesTable from "@/features/branches/components/BranchesTable";
import { getBranches } from "@/features/branches/services/branch.service";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";

export default function Page() {
    
    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches
    })

    // const branches = data

    console.log(data);

    const { user } = useAuth();

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            <div className="flex gap-8">
                <div className="relative w-full lg:w-2/3 bg-linear-to-tr from-cyan-600/40 to-cyan-400 rounded-2xl border-2 border-cyan-50 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
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

            <div className="bg-white shadow-sm rounded-lg flex flex-col gap-4">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-semibold">Mis sucursales</h1>
                </div>
                <BranchesTable/>
            </div>
        </div>
    );
}