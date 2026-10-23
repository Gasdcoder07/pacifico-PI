"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import ProductCard from "./ProductCard";

const ProductCatalog = ({ isCartPanelShowed } : { isCartPanelShowed : boolean}) => {
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const products = data?.flatMap((branch) => branch.productos) ?? [];

    if (isLoading) return <Skeleton/>

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
        <div className="flex-1 animate-pulse duration-200 ease-in-out transition-all bg-neutral-200 flex min-h-0 min-w-0 basis-3/4 rounded-lg"/>
    )
}