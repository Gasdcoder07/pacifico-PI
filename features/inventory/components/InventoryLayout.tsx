"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/sell/services/product.service";

import ProductSearch from "@/features/sell/components/ProductSearch";
import AddProductButton from "./AddProductButton";
import InventoryTable from "./InventoryTable";

const InventoryLayout = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const products = data?.flatMap((branch) => branch.productos) ?? [];
    const hasProducts = products.length > 0;

    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            {
                hasProducts && (
                <div className="flex items-center justify-between gap-4 w-full">
                    <ProductSearch/>

                    <AddProductButton/>
                </div>
                )
            }

            <div className="min-h-0 min-w-0 flex-1">
                <InventoryTable
                    isLoading={isLoading}
                    products={products}/>
            </div>
        </section>
    );
};

export default InventoryLayout;
