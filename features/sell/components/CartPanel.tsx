"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cart-store";

const CartPanel = () => {
    const scrollbarStyles =
        "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const removeProductCompletely = useCartStore(
        (state) => state.removeProductCompletely,
    );
    const clearCart = useCartStore((state) => state.clearCart);

    const subtotal = cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    return (
        <motion.section
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex min-h-0 min-w-0 basis-1/4 flex-col rounded-lg border border-neutral-200 bg-white shadow-sm"
        >
            <div className="border-b border-neutral-200 p-4 flex items-center justify-between gap-2">
                <h3 className="font-semibold truncate">Detalles de la orden</h3>

                <motion.button
                    onClick={clearCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors font-medium cursor-pointer"
                    title="Vaciar todo el carrito"
                >
                    <Trash2 className="size-3.5" />
                    <span>Vaciar</span>
                </motion.button>
            </div>

            {/* Lista de productos */}
            <div
                className={`flex flex-col min-h-0 min-w-0 h-full p-4 overflow-y-auto gap-2 ${scrollbarStyles}`}
            >
                {cart.map((item) => {
                    const product = item.product;

                    return (
                        <div
                            key={product.inventario_id}
                            className="relative flex flex-col rounded-lg border border-neutral-200 shadow-sm p-2 gap-2 group"
                        >
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <img
                                        className="h-8 w-10 shrink-0 object-cover rounded-lg"
                                        src={product.foto_url}
                                        alt={product.name}
                                    />
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="text-xs font-semibold truncate">
                                            {product.name}
                                        </h3>
                                    </div>
                                </div>

                                <span className="text-xs shrink-0 bg-neutral-200 size-6 rounded-full flex items-center justify-center font-medium">
                                    x{item.quantity}
                                </span>

                                {/* Botón para eliminar el tipo de producto completo */}
                                <motion.button
                                    onClick={() =>
                                        removeProductCompletely(
                                            product.inventario_id,
                                        )
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-md cursor-pointer"
                                    title="Eliminar producto completo"
                                >
                                    <Trash2 className="size-3.5" />
                                </motion.button>
                            </div>

                            <div className="mt-auto flex justify-between items-center gap-2">
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() =>
                                            removeFromCart(
                                                item.product.inventario_id,
                                            )
                                        }
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        className="rounded-full p-1 bg-cyan-400 cursor-pointer"
                                    >
                                        <Minus className="size-3 text-white" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => addToCart(item.product)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        className="rounded-full p-1 bg-cyan-400 cursor-pointer"
                                    >
                                        <Plus className="size-3 text-white" />
                                    </motion.button>
                                </div>
                                <span className="text-xs font-bold">
                                    ${(product.price * item.quantity).toFixed(2) }
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Totales y Confirmación */}
            <div className="border-t border-neutral-200 p-4 text-xs text-neutral-400 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <p>Subtotal: </p>
                    <p className="text-black font-semibold">
                        ${subtotal.toFixed(2)}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <p>IVA (16%): </p>
                    <p className="text-black font-semibold">${iva.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p>Total: </p>
                    <p className="text-black font-semibold">
                        ${total.toFixed(2)}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.2,
                        ease: "easeInOut",
                    }}
                    className="mt-4 bg-cyan-400 py-2 rounded-full px-4 text-white font-semibold cursor-pointer"
                >
                    Confirmar orden
                </motion.button>
            </div>
        </motion.section>
    );
};

export default CartPanel;
