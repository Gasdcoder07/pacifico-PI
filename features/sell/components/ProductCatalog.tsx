"use client";

import { Product } from "../types/product";

import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import SearchEmptyState from "@/shared/components/SearchEmptyState";

interface ProductCatalogProps {
    isCartPanelShowed: boolean;
    products: Product[];
    isSearching: boolean;
    onClearSearch: () => void;
    isLoading: boolean;
}

const ProductCatalog = ({ isCartPanelShowed, products, isSearching, onClearSearch, isLoading } : ProductCatalogProps) => {
    if (isLoading) return <Skeleton/>

    if (products.length === 0) {
        return isSearching
            ? <SearchEmptyState onClearSearch={onClearSearch}/>
            : <EmptyState/>
    }

    return (
        <section className="flex flex-1 min-h-0 min-w-0 w-full flex-col gap-4">
            <div className={`min-h-0 flex-1`}>
                <div className={`grid gap-4 ${isCartPanelShowed ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {products.map((product) => {
                        return (
                            <ProductCard
                                key={product.inventario_id}
                                product={product}/>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductCatalog;

const Skeleton = () => {
    return (
        <div className="flex-1 animate-pulse duration-200 ease-in-out transition-all bg-neutral-200 dark:bg-slate-800 flex min-h-0 min-w-0 basis-3/4 rounded-lg"/>
    )
}