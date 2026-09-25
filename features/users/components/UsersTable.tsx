"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/sell/services/product.service";
import { Product } from "@/features/sell/types/product";
import { Edit, Ellipsis, Trash } from "lucide-react";

const UsersTable = () => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getProducts
    })

    // const products = data?.flatMap((branch) => branch.productos) ?? [];

    // if (isLoading) return <InventoryTableSkeleton/>;

    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" }
    ];

    return (
        <div className="bg-white flex flex-col flex-1 min-h-0 min-w-0 border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${scrollbarStyles}`}>

                <table className="w-full">
                    <thead className="bg-white sticky top-0 z-10 text-left text-xs text-neutral-600 tracking-wider uppercase border-b border-neutral-200 whitespace-nowrap">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-200">
                        {users.map((user: any) => {
                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
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
                            );
                        })}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default UsersTable;

// interface InventoryTableRowProps {
//     product: Product;
// }

// export const InventoryTableRow = ({ product }: InventoryTableRowProps) => {
//     return (
//         <tr>
//             <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">
//                 #{product.inventario_id}
//             </td>
//             <td title={product.name} className="px-4 py-3">
//                 <div className="flex items-center justify-start gap-4">
//                     <div className="h-16 w-20 rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
//                         <img
//                             src={product.foto_url}
//                             alt={product.name}
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                     <div className="flex flex-col gap-1">
//                         <p className="truncate whitespace-nowrap font-semibold">{product.name}</p>
//                         <p className="text-xs text-neutral-600">Comida</p>
//                     </div>
//                 </div>                                       
//             </td>
//             <td className="px-4 py-3 text-xs text-neutral-600">
//                 <div className="flex flex-col gap-1">
//                     <p className="truncate whitespace-nowrap font-medium">Las Brisas</p>
//                 </div>
//             </td>
//             <td className="px-4 py-3 text-neutral-600 text-sm">
//                 {product.quantity}
//             </td>
//             <td className="hidden xl:table-cell px-4 py-3 text-neutral-600 text-sm">
//                 <StockBadge quantity={product.quantity}/>
//             </td>
//             <td className="px-4 py-3 text-right font-semibold text-sm">
//                 ${product.price.toFixed(2)}
//             </td>
//             <td className="px-4 py-3">
//                 <div className="flex justify-center items-center gap-2">
//                     <DropdownActionButton/>
//                 </div>
//             </td>
//         </tr>
//     )
// }

// interface StockBadgeProps {
//     quantity: number;
// }

// export const StockBadge = ({ quantity } : StockBadgeProps) => {
//     let badgeStyles = "";
//     let dotStyles = "";
//     let label = "";

//     if (quantity === 0) {
//         badgeStyles = 'bg-red-50 text-red-700 border-red-200';
//         dotStyles = 'bg-red-500';
//         label = 'Sin stock';
//     } else if (quantity > 0 && quantity <= 8) {
//         badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
//         dotStyles = 'bg-amber-500';
//         label = 'Stock bajo';
//     } else {
//         badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
//         dotStyles = 'bg-emerald-500';
//         label = 'En stock';
//     }

//     return (
//         <span className={`shrink-0 whitespace-nowrap flex items-center justify-center gap-2 px-1.5 py-1 border rounded-full ${badgeStyles}`}>
//             <div className={`size-1.5 rounded-full ${dotStyles}`}/>
//             {label}
//         </span>
//     )
// }

// export const DropdownActionButton = () => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [open, setOpen] = useState(false);
    
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//             setOpen(false);
//         }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <div className="relative shrink-0 flex justify-center items-center gap-2" ref={containerRef}>
//             <motion.button
//                 aria-haspopup="true"
//                 aria-expanded={open}
//                 whileHover={{ 
//                 scaleX: 1.1, 
//                 scaleY: 1.1,
//                 borderRadius: "35%",
//                 }}
//                 whileTap={{ 
//                 scaleX: 0.9, 
//                 scaleY: 1.1, 
//                 borderRadius: "50%",
//                 }}
//                 transition={{ 
//                 type: "spring", 
//                 bounce: 0.6, 
//                 duration: 0.8
//                 }}
//                 className="bg-linear-to-b from-brand-50 to-brand-100 text-brand-700 cursor-pointer p-1 rounded-lg" onClick={() => setOpen(!open)}>
//                 <Ellipsis size={20}/>
//             </motion.button>

//             {
//                 open && (
//                     <div
//                         className="absolute right-0 -top-12 -translate-x-1/5 z-10 flex flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white shadow-sm p-2 w-44 origin-top-right">
//                         <button
//                             className="w-full text-neutral-900 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-100">
//                             <Edit size={18}/>
//                             <span>Editar</span>
//                         </button>
//                         <button
//                             className="w-full text-neutral-900 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-red-50 hover:text-red-600">
//                             <Trash size={18}/>
//                             <span>Eliminar</span>
//                         </button>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// export const InventoryTableSkeleton = () => {
//     return (
//         <div className="h-full w-full bg-neutral-200 flex flex-col flex-1 min-h-0 min-w-0 rounded-lg shadow-sm"/>
//     )
// }