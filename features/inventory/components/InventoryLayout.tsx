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

const PAGE_SIZE = 10;

const InventoryLayout = () => {
    const { user: currentUser } = useAuth();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const isSearching = search.trim().length > 0;

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const products = data?.flatMap((branch) => branch.productos) ?? [];

    const hasProducts = products.length > 0;
    const isAdmin = currentUser?.rol_id === 1;

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
            {
                hasProducts && (
                <div className="flex w-full min-w-0 items-center justify-between gap-4">
                    <div className="w-full">
                        <ProductSearch
                            value={search}
                            onChange={handleSearchChange}/>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                        <CategoryButton/>
                        <AddProductButton/>
                    </div>
                </div>
                )
            }

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
