import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getBranches } from "../services/branch.service";
import { Branch } from "../types/branch";
import { formatPhoneNumber } from "@/shared/utils/formatters";
import { Edit, Trash, Ellipsis } from "lucide-react";

const BranchesTable = () => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches
    })

    const branches = data ? data : [];

    return (
        <div className={`flex-1 pt-0 p-8 overflow-y-auto overflow-x-hidden ${scrollbarStyles}`}>
            <table className="w-full table-fixed">
                <thead className="bg-white sticky top-0 z-10 text-left text-xs text-neutral-600 tracking-wider uppercase border-b border-neutral-200 whitespace-nowrap">
                    <tr>
                        <th className="w-[15%] pr-6 py-3 font-medium">Nombre</th>
                        <th className="w-[30%] pr-6 py-3 font-medium">Dirección</th>
                        <th className="w-[15%] pr-6 py-3 font-medium">Teléfono</th>
                        <th className="w-[20%] pr-6 py-3 font-medium">Contacto</th>
                        <th className="w-[10%] pr-6 py-3 text-right font-medium">Estado</th>
                        <th className="w-[10%] py-3 text-right font-medium">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                    {
                        isLoading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <BranchesTableSkeleton key={idx} />
                            ))
                        ) : (
                            branches.map((branch) => (
                                <BranchesTableRow key={branch.id} branch={branch} />
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default BranchesTable;

const BranchesTableRow = ({ branch }: { branch: Branch }) => {
    return (
        <tr className="text-sm text-neutral-700">
            <td className="py-3 pr-6 font-semibold">{branch.name}</td>
            <td className="py-3 pr-6">{branch.direction || "-"}</td>
            <td className="py-3 pr-6 tracking-widest">{formatPhoneNumber(branch.phone)}</td>
            <td className="py-3 pr-6">
                <p className="text-blue-500 whitespace-nowrap truncate">
                    {branch.contact_info || "-"}
                </p>
            </td>
            <StatusBadge status={branch.status} />
            <td className="py-3 text-right">
                <DropdownActionButton />
            </td>
        </tr>
    )
}

const StatusBadge = ({ status }: { status: boolean }) => {
    let styles = status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200';

    return (
        <td className="py-3 pr-6 text-right">
            <span className={`inline-flex justify-center items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
                {status ? 'Activo' : 'Inactivo'}
            </span>
        </td>
    )
}

export const DropdownActionButton = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative shrink-0 flex justify-end items-center gap-2" ref={containerRef}>
            <motion.button
                aria-haspopup="true"
                aria-expanded={open}
                whileHover={{ 
                scaleX: 1.1, 
                scaleY: 1.1,
                borderRadius: "35%",
                }}
                whileTap={{ 
                scaleX: 0.9, 
                scaleY: 1.1, 
                borderRadius: "50%",
                }}
                transition={{ 
                type: "spring", 
                bounce: 0.6, 
                duration: 0.8
                }}
                className="bg-linear-to-b from-brand-50 to-brand-100 text-brand-700 cursor-pointer p-1 rounded-lg" onClick={() => setOpen(!open)}>
                <Ellipsis size={20}/>
            </motion.button>

            {
                open && (
                    <div
                        className="absolute right-0 -top-12 -translate-x-1/5 z-10 flex flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white shadow-sm p-2 w-44 origin-top-right">
                        <button
                            className="w-full text-neutral-900 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-100">
                            <Edit size={18}/>
                            <span>Editar</span>
                        </button>
                        <button
                            className="w-full text-neutral-900 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-red-50 hover:text-red-600">
                            <Trash size={18}/>
                            <span>Eliminar</span>
                        </button>
                    </div>
                )
            }
        </div>
    )
}

const BranchesTableSkeleton = () => {
    return (
        <tr>
            <td colSpan={6} className="py-3">
                <div className="h-5 w-full bg-neutral-200 animate-pulse transition-all duration-200 ease-in-out rounded-lg"/>
            </td>
        </tr>
    )
}