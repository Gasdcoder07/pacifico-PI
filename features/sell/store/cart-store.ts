import { create } from "zustand";
import { CartState } from "../types/cart";
import { Product } from "../types/product";

export const useCartStore = create<CartState>((set) => ({
    cart: [],

    // Añadir al carrito
    addToCart: (product: Product) =>
        set((state) => {
            const existingItem = state.cart.find(
                (item) => item.product.inventario_id === product.inventario_id,
            );

            if (existingItem) {
                return {
                    cart: state.cart.map((item) =>
                        item.product.inventario_id === product.inventario_id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                };
            }

            return { cart: [...state.cart, { product, quantity: 1 }] };
        }),

    // Remover una unidad del carrito
    removeFromCart: (productId: number) =>
        set((state) => {
            const existingItem = state.cart.find(
                (item) => item.product.inventario_id === productId,
            );

            if (existingItem?.quantity === 1) {
                return {
                    cart: state.cart.filter(
                        (item) => item.product.inventario_id !== productId,
                    ),
                };
            }

            return {
                cart: state.cart.map((item) =>
                    item.product.inventario_id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                ),
            };
        }),

    // Eliminar un producto completo del carrito sin importar su cantidad
    removeProductCompletely: (productId: number) =>
        set((state) => ({
            cart: state.cart.filter(
                (item) => item.product.inventario_id !== productId,
            ),
        })),

    // Limpiar carrito completo
    clearCart: () => set({ cart: [] }),
}));
