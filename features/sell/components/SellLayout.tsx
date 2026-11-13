"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "../store/cart-store";
import { getProducts, searchProductsByName } from "../services/product.service";

import ProductSearch from "./ProductSearch";
import ProductCatalog from "./ProductCatalog";
import AnimatedCart from "./AnimatedCart";

const scrollbarStyles =
    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

const SellLayout = () => {
    const cart = useCartStore((state) => state.cart);
    const hasProducts = cart.length > 0;

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const isSearching = search.trim().length > 0;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 350);

        return () => clearTimeout(timeout);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const { data: searchData, isLoading: isSearchLoading } = useQuery({
        queryKey: ["searchProductsByName", debouncedSearch],
        queryFn: () => searchProductsByName(debouncedSearch),
        enabled: !!debouncedSearch
    });

    const products = data?.flatMap((branch) => branch.productos) ?? [];
    const hasSearch = search.trim().length > 0;

    const isDebouncing =
        hasSearch && search.trim() !== debouncedSearch;

    const displayedProducts = hasSearch
        ? isDebouncing
            ? []
            : (searchData?.data ?? [])
        : products;

    const isCatalogLoading = hasSearch
        ? isDebouncing || isSearchLoading
        : isLoading;

    const handleClearSearch = () => {
        setSearch("");
    }

    return (
        <section className="flex h-full min-h-0 min-w-0 gap-4 overflow-hidden p-4">
            <div className={`flex flex-col gap-4 overflow-auto ${hasProducts ? 'basis-7/10' : 'w-full'} ${scrollbarStyles}`}>
                { !isLoading && products.length > 0 && (
                    <div className="w-full">
                        <ProductSearch
                            value={search}
                            onChange={setSearch}/>
                    </div>
                )}

                <ProductCatalog
                    isCartPanelShowed={hasProducts}
                    products={displayedProducts}
                    isSearching={isSearching}
                    onClearSearch={handleClearSearch}
                    isLoading={isCatalogLoading}/>
            </div>

            <AnimatePresence initial={false}>
                {hasProducts && <AnimatedCart/>}
            </AnimatePresence>
        </section>
    );
};

export default SellLayout;