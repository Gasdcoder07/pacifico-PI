import { Eye, Pencil, Trash } from "lucide-react";

const InventoryTable = ({ PRODUCTS }: any) => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    return (
        <div className="bg-white flex flex-col flex-1 min-h-0 min-w-0 border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${scrollbarStyles}`}>

                <table className="w-full table-fixed">
                    <thead className="bg-white sticky top-0 z-10 text-left border-b border-neutral-200 whitespace-nowrap">
                        <tr>
                            <th className="w-28 px-4 py-3">Código</th>
                            <th className="w-[clamp(160px,28vw,320px)] px-4 py-3">Producto</th>
                            <th className="hidden xl:table-cell w-36 px-4 py-3">Categoría</th>
                            <th className="w-20 px-4 py-3">Stock</th>
                            <th className="hidden xl:table-cell w-36 px-4 py-3">Estatus</th>
                            <th className="w-28 px-4 py-3 text-right">Precio</th>
                            <th className="w-32 px-4 py-3 text-right">Acción</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-200">
                        {PRODUCTS.map((product: any) => {
                            const isOutOfStock = product.stock === 0;
                            const isLowStock =
                                product.stock > 0 && product.stock <= 8;

                            return (
                                <tr
                                    key={product.id}
                                >
                                    <td className="px-4 py-3 text-xs text-neutral-600">
                                        {product.code}
                                    </td>
                                    <td title={product.name} className="px-4 py-3 font-semibold truncate">
                                        {product.name}
                                    </td>
                                    <td className="hidden xl:table-cell px-4 py-3 text-neutral-600 text-sm">
                                        <div className="truncate">
                                            {product.category}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-neutral-600 text-sm">
                                        {product.stock}
                                    </td>
                                    <td className="hidden xl:table-cell px-4 py-3 text-neutral-600 text-sm">
                                        {
                                            isOutOfStock ? (
                                                <span className="bg-red-50 text-red-700 border border-red-200 rounded-full flex items-center justify-center gap-2 px-1.5 py-1">
                                                    <div className="size-1.5 rounded-full bg-red-500"/>
                                                    Sin stock
                                                </span>
                                            ) : isLowStock ? (
                                                <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center gap-2 px-1.5 py-1">
                                                    <div className="size-1.5 rounded-full bg-amber-500"/>
                                                    Stock bajo
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center gap-2 px-1.5 py-1">
                                                    <div className="size-1.5 rounded-full bg-emerald-500"/>
                                                    En stock
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-sm">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end items-center gap-2 text-neutral-600">
                                            <button className="cursor-pointer"><Eye size={20}/></button>
                                            <button className="cursor-pointer"><Trash size={20}/></button>
                                            <button className="cursor-pointer"><Pencil size={20}/></button>
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

export default InventoryTable;
