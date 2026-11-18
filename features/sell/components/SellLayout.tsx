
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { useCartStore } from "../store/cart-store";
import { getProducts, searchProductsByName } from "../services/product.service";

import ProductSearch from "./ProductSearch";
import ProductCatalog from "./ProductCatalog";
import AnimatedCart from "./AnimatedCart";
import CategoryFilter from "@/shared/components/CategoryFilter";

const scrollbarStyles =
    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

const SellLayout = () => {
    const cart = useCartStore((state) => state.cart);
    const hasProducts = cart.length > 0;

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const isSearching = search.trim().length > 0;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 350);

        return () => clearTimeout(timeout);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ["products", { category: selectedCategory }],
        queryFn: () => getProducts({
            category: selectedCategory || undefined,
        }),
        staleTime: 60_000,
    });

    const {
        data: searchData,
        isLoading: isSearchLoading,
    } = useQuery({
        queryKey: ["searchProductsByName", debouncedSearch],
        queryFn: () => searchProductsByName(debouncedSearch),
        enabled: !!debouncedSearch,
    });

    const products = data?.flatMap(
        (branch) => branch.productos
    ) ?? [];

    const isDebouncing =
        isSearching && search.trim() !== debouncedSearch;

    const filteredSearchProducts = (searchData?.data ?? []).filter(
        (product) =>
            !selectedCategory ||
            String(product.category_id) === selectedCategory
    );

    const displayedProducts = isSearching
        ? isDebouncing
            ? []
            : filteredSearchProducts
        : products;

    const isCatalogLoading = isSearching
        ? isDebouncing || isSearchLoading
        : isLoading;

    const handleClearSearch = () => {
        setSearch("");
    };

    return (
        <section className="flex h-full min-h-0 min-w-0 gap-4 overflow-hidden p-4">
            <div
                className={`flex min-w-0 flex-col gap-4 overflow-auto ${
                    hasProducts ? "basis-7/10" : "w-full"
                } ${scrollbarStyles}`}
            >
                <div className="flex w-full min-w-0 flex-wrap items-center gap-4">
                    <div className="min-w-46 flex-1 max-w-sm">
                        <ProductSearch
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <CategoryFilter
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                    />
                </div>

                <ProductCatalog
                    isCartPanelShowed={hasProducts}
                    products={displayedProducts}
                    isSearching={isSearching}
                    onClearSearch={handleClearSearch}
                    isLoading={isCatalogLoading}
                />
            </div>

            <AnimatePresence initial={false}>
                {hasProducts && <AnimatedCart />}
            </AnimatePresence>
        </section>
    );
};

export default SellLayout;