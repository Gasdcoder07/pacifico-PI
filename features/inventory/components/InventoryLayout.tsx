"use client";

import { useState } from "react";
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

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const isSearching = search.trim().length > 0;

    const { data, isLoading } = useQuery({
        queryKey: [
            "products",
            { branch: selectedBranch, category: selectedCategory }
        ],
        queryFn: () => getProducts({
            branch: selectedBranch || undefined,
            category: selectedCategory || undefined,
        }),
        staleTime: 60_000,
    });

    const products = data?.flatMap((branch) => branch.productos) ?? [];

    const hasProducts = products.length > 0;

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages) return;

        setPage(nextPage);
    };

    const handleClearSearch = () => {
        setSearch("");
        setPage(1);
    }

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
                    isLoading={isLoading}
                    products={paginatedProducts}
                    isSearching={isSearching}
                    onClearSearch={handleClearSearch}
                    isAdmin={isAdmin}/>
            </div>
            {
                !isLoading && hasProducts && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}/>
                )
            }
        </section>
    );
};

export default InventoryLayout;
