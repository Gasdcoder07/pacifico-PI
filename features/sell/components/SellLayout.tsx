
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { useCartStore } from "../store/cart-store";
import { getProducts } from "../services/product.service";

import ProductSearch from "./ProductSearch";
import ProductCatalog from "./ProductCatalog";
import AnimatedCart from "./AnimatedCart";
import CategoryFilter from "@/shared/components/CategoryFilter";
import PaginationControls from "@/shared/components/PaginationControls";

const PAGE_SIZE = 10;

const scrollbarStyles =
    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

const SellLayout = () => {
    const cart = useCartStore((state) => state.cart);
    const hasProducts = cart.length > 0;

    const [page, setPage] = useState(1);
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

    const isDebouncing = search.trim() !== debouncedSearch;

    const { data, isLoading } = useQuery({
        queryKey: [
            "products",
            "sell",
            {
                page,
                category: selectedCategory,
                search: debouncedSearch,
            },
        ],
        queryFn: () =>
            getProducts({
                page,
                limit: PAGE_SIZE,
                category: selectedCategory || undefined,
                search: debouncedSearch || undefined,
            }),
        staleTime: 60_000,
    });

    const products =
        data?.data.flatMap((branch) => branch.productos) ?? [];

    const totalPages = data?.pagination.totalPages ?? 0;

    const isCatalogLoading = isLoading || isDebouncing;

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;

        setPage(nextPage);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch("");
        setDebouncedSearch("");
        setPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setPage(1);
    };

    return (
        <section className="flex h-full min-h-0 min-w-0 gap-4 overflow-hidden p-4">
            <div
                className={`flex min-h-0 min-w-0 flex-col gap-4 overflow-hidden ${
                    hasProducts ? "basis-7/10" : "w-full"
                }`}
            >
                <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-4">
                    <div className="min-w-46 flex-1 max-w-sm">
                        <ProductSearch
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <CategoryFilter
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    />
                </div>

                <div
                    className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto ${scrollbarStyles}`}
                >
                    <ProductCatalog
                        isCartPanelShowed={hasProducts}
                        products={products}
                        isSearching={isSearching}
                        onClearSearch={handleClearSearch}
                        isLoading={isCatalogLoading}
                    />
                </div>

                {!isLoading && !isDebouncing && totalPages > 1 && (
                    <div className="shrink-0">
                        <PaginationControls
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <AnimatePresence initial={false}>
                {hasProducts && <AnimatedCart />}
            </AnimatePresence>
        </section>
    );
};

export default SellLayout;