"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getProducts } from "@/features/sell/services/product.service";

import ProductSearch from "@/features/sell/components/ProductSearch";
import AddProductButton from "./AddProductButton";
import InventoryTable from "./InventoryTable";
import { CategoryButton } from "../../categories/components/CategoriesButton";

const InventoryLayout = () => {
    const { user: currentUser } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const products = data?.flatMap((branch) => branch.productos) ?? [];

    const hasProducts = products.length > 0;
    const isAdmin = currentUser?.rol_id === 1;

    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            {
                hasProducts && (
                <div className="flex w-full min-w-0 items-center justify-between gap-4">
                    <ProductSearch/>

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
                    products={products}
                    isAdmin={isAdmin}/>
            </div>
        </section>
    );
};

export default InventoryLayout;
