"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import BranchesTable from "@/features/branches/components/BranchesTable";
import { getBranches } from "@/features/branches/services/branch.service";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";

export default function Page() {
    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });

    // const branches = data

    console.log(data);

    const { user } = useAuth();

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
            <div className="flex gap-8">
                <div className="relative w-full max-w-lg overflow-hidden rounded-lg text-white shadow-sm flex items-center p-6">
                    <div className="absolute z-10 -bottom-12 -left-12 size-48 rounded-full bg-cyan-300/40 blur-2xl pointer-events-none" />
                    <div className="absolute z-10 -bottom-10 left-1/3 size-52 rounded-full bg-cyan-300/60 blur-3xl pointer-events-none" />
                    <div className="absolute z-10 -top-12 -left-6 size-40 rounded-full bg-cyan-300/60 blur-2xl pointer-events-none" />

                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                        alt="Sucursal"
                        className="absolute right-0 top-0 h-full w-3/5 object-cover object-center"
                    />

                    <svg
                        className="absolute inset-0 h-full w-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            className="fill-cyan-500/10"
                            d="M 0,0 L 73,0 C 85,35 58,65 77,100 L 0,100 Z"
                        />
                    </svg>

                    <svg
                        className="absolute inset-0 h-full w-full pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#00b8db"
                            d="M 0,0 L 65,0 C 79,35 52,65 70,100 L 0,100 Z"
                        />
                    </svg>

                    <div className="relative z-10 flex flex-col justify-between max-w-3/4 gap-4">
                        <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">
                            Sucursal con mejores ganancias
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20 border border-white/20 shadow-inner">
                                <Trophy size={24} className="text-yellow-300" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-xl leading-relaxed drop-shadow-sm">
                                    Sucursal Manzanillo
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-4xl font-black drop-shadow-sm">
                                $128,000
                            </span>
                            <span className="text-sm font-medium">
                                en ganancias totales
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-xs border border-neutral-200 rounded-lg p-4 flex flex-col gap-4 shadow-sm">
                    <h3 className="text-xl text-neutral-900 font-bold">
                        Top 3 Sucursales
                    </h3>

                    <div className="flex flex-col gap-2">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-amber-500 text-white font-bold text-xs">
                                    1
                                </div>
                                <h4 className="text-neutral-900 font-semibold text-sm truncate">
                                    Manzanillo
                                </h4>
                            </div>

                            <p className="text-sm font-bold text-neutral-900 shrink-0">
                                $128,000
                            </p>
                        </div>

                        <div className="bg-slate-500/10 border border-slate-500/20 p-2 rounded flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-slate-500 text-white font-bold text-xs">
                                    2
                                </div>
                                <h4 className="text-neutral-900 font-semibold text-sm truncate">
                                    Las Brisas
                                </h4>
                            </div>

                            <p className="text-sm font-bold text-neutral-900 shrink-0">
                                $97,720
                            </p>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="size-6 flex shrink-0 justify-center items-center rounded-full bg-orange-600 text-white font-bold text-xs">
                                    3
                                </div>
                                <h4 className="text-neutral-900 font-semibold text-sm truncate">
                                    Valle de las Garzas
                                </h4>
                            </div>

                            <p className="text-sm font-bold text-neutral-900 shrink-0">
                                $72,190
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg flex flex-col gap-4">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-semibold">Mis sucursales</h1>
                </div>
                <BranchesTable />
            </div>
        </div>
    );
}
