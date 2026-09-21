import CartPanel from "@/features/sell/components/CartPanel";
import ProductCatalog from "@/features/sell/components/ProductCatalog";
import ProductSearch from "@/features/sell/components/ProductSearch";

const Page = () => {
    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            <ProductSearch/>

            <div className="flex min-h-0 flex-1 gap-4">
                {/* Contenedor de productos */}
                <ProductCatalog/>

                {/* Carrito de productos */}
                <CartPanel/>
            </div>
        </section>
    )
};

export default Page;
