"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getProducts } from "@/features/sell/services/product.service";

import ProductSearch from "@/features/sell/components/ProductSearch";
import AddProductButton from "./AddProductButton";
import InventoryTable from "./InventoryTable";
import { CategoryButton } from "../../categories/components/CategoriesButton";
import PaginationControls from "@/shared/components/PaginationControls";
import BranchFilter from "@/shared/components/BranchFilter";
import CategoryFilter from "@/shared/components/CategoryFilter";

const PAGE_SIZE = 10;

const InventoryLayout = () => {
    const { user: currentUser } = useAuth();
    const isAdmin = currentUser?.rol_id === 1;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedBranch, setSelectedBranch] = useState("");
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
            {
                page,
                branch: selectedBranch,
                category: selectedCategory,
                search: debouncedSearch,
            },
        ],
        queryFn: () =>
            getProducts({
                page,
                limit: PAGE_SIZE,
                branch: selectedBranch || undefined,
                category: selectedCategory || undefined,
                search: debouncedSearch || undefined,
            }),
        enabled: !!currentUser,
        staleTime: 60_000,
    });

    const products =
        data?.data.flatMap((branch) => branch.productos) ?? [];

    const totalPages = data?.pagination.totalPages ?? 0;

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;

        setPage(nextPage);
    };

    const handleClearSearch = () => {
        setSearch("");
        setDebouncedSearch("");
        setPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4">
                <div className="min-w-46 flex-1">
                    <ProductSearch
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Filtros y acciones */}
                <div className="flex flex-wrap items-center gap-2">
                    {isAdmin && (
                        <BranchFilter
                            value={selectedBranch}
                            onChange={(value) => {
                                setSelectedBranch(value);
                                setPage(1);
                            }}
                        />
                    )}

                    <CategoryFilter
                        value={selectedCategory}
                        onChange={(value) => {
                            setSelectedCategory(value);
                            setPage(1);
                        }}
                    />

                    {isAdmin && <CategoryButton />}

                    <AddProductButton />
                </div>
            </div>

            <div className="min-h-0 min-w-0 flex-1">
                <InventoryTable
                    isLoading={isLoading || isDebouncing}
                    products={products}
                    isSearching={isSearching}
                    onClearSearch={handleClearSearch}
                    isAdmin={isAdmin}
                />
            </div>

            {!isLoading && !isDebouncing && totalPages > 1 && (
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </section>
    );
};

export default InventoryLayout;
