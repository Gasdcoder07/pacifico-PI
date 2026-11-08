"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/cart-store";
import { getProducts } from "../services/product.service";

import ProductSearch from "./ProductSearch";
import ProductCatalog from "./ProductCatalog";
import AnimatedCart from "./AnimatedCart";

const SellLayout = () => {
    const cart = useCartStore((state) => state.cart);
    const hasProducts = cart.length > 0;

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const products = data?.flatMap((branch) => branch.productos) ?? [];

    const scrollbarStyles =
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

    return (
        <section className="flex h-full min-h-0 min-w-0 gap-4 overflow-hidden p-4">
            <div className={`flex flex-col gap-4 overflow-auto ${hasProducts ? 'basis-7/10' : 'w-full'} ${scrollbarStyles}`}>
                { !isLoading && products.length > 0 && <ProductSearch/> }

                <ProductCatalog
                    isCartPanelShowed={hasProducts}
                    products={products}
                    isLoading={isLoading}/>
            </div>

            <AnimatePresence initial={false}>
                {hasProducts && <AnimatedCart/>}
            </AnimatePresence>
        </section>
    );
};

export default SellLayout;