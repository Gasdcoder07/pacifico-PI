"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Page () {

    const { user } = useAuth()

    return (
        <div className="p-8 flex flex-col">
            <div className="flex flex-row gap-8">
                <div className="relative w-2/3 h-96 bg-linear-to-tr from-cyan-600/40 to-cyan-400 rounded-2xl border-2 border-cyan-50 p-8">
                    <div className="absolute bg-linear-to-l from-cyan-50 to-cyan-50/20 w-56 h-56 bottom-20 right-20 blur-3xl animate-pulse"/>
                    <div className="absolute bg-linear-to-l from-cyan-50 to-cyan-50/20 w-64 h-64 top-20 left-20 blur-3xl animate-pulse"/>
                    <h1 className="text-white text-4xl font-bold my-4">Sucursal con mejores ganancias</h1>
                    <div className="w-[80%] backdrop-blur-3xl rounded-3xl px-4 py-12 shadow-2xl">
                        <h2 className="text-2xl bg-clip-text text-transparent bg-linear-to-r from-zinc-50 to-cyan-50 mb-2">Sucursal Manzanillo {user?.name}</h2>
                        <h1 className="text-7xl font-semibold text-cyan-50">$128,000</h1>
                    </div>
                </div>
                <div className="relative w-1/3 bg-white/80 rounded-3xl p-8">
                    <div className="absolute w-36 h-36 bg-zinc-500/30 top-15 right-10 blur-3xl animate-pulse"/>
                    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-zinc-700 to-zinc-500/30">Top 3</h1>
                    <ul className="ml-6 mt-10 flex flex-col gap-12 font-semibold text-zinc-500 bg-zinc-600 p-2 rounded-2xl">
                        <li className="text-2xl">Manzanillo</li>
                        <li className="text-2xl">Tecomán</li>
                        <li className="text-2xl">Guerrero</li>
                    </ul>
                </div>
            </div>
             <div className="flex flex-row gap-8 mt-8">
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
             </div>
             <div className="flex flex-row gap-8 mt-8">
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
             </div>
             <div className="flex flex-row gap-8 mt-8">
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
                <div className="w-1/3 bg-zinc-200 h-64 rounded-3xl animate-pulse"></div>
             </div>
        </div>
    )
}