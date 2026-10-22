import { create } from "zustand";
import { CartState } from "../types/cart";
import { Product } from "../types/product";

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  // Añadir al carrito (suma 1 por defecto o la cantidad especificada)
  addToCart: (product: Product, amount = 1) =>
    set((state) => {
        if (product.quantity <= 0 || amount <= 0) return state;

      const existingItem = state.cart.find(
        (item) => item.product.inventario_id === product.inventario_id
      );

      const currentQuantity = existingItem?.quantity ?? 0;

      const newQuantity = Math.min(
        product.quantity,
        currentQuantity + amount
      );

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.inventario_id === product.inventario_id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      }

      return { cart: [...state.cart, { product, quantity: newQuantity }] };
    }),

  // Establecer una cantidad exacta (mínimo 1)
  setQuantity: (productId: number, quantity: number) =>
    set((state) => ({
        cart: state.cart.map((item) => {
            if (item.product.inventario_id !== productId) {
                return item;
            }

            return {
                ...item,
                quantity: Math.min(
                    item.product.quantity,
                    Math.max(1, Math.floor(quantity))
                ),
            };
        })
    })),

  // Remover una unidad del carrito
  removeFromCart: (productId: number) =>
    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.product.inventario_id === productId
      );

      if (!existingItem) return state;

      if (existingItem.quantity === 1) {
        return {
          cart: state.cart.filter(
            (item) => item.product.inventario_id !== productId
          ),
        };
      }

      return {
        cart: state.cart.map((item) =>
          item.product.inventario_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }),

  // Eliminar un producto completo
  removeProductCompletely: (productId: number) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) => item.product.inventario_id !== productId
      ),
    })),

  // Vaciar carrito
  clearCart: () => set({ cart: [] }),
}));