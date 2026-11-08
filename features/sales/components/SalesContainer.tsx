import { Sale } from "@/features/sell/types/sale";
import { SaleCard } from "./SaleCard";

interface SalesContainerProps {
    sales?: Sale[];
    isLoading: boolean;
}

const SalesContainer = ({ sales, isLoading } : SalesContainerProps) => {

    if (isLoading) return <Skeleton/>

    return (
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 pb-4 sm:pb-6 lg:pb-8">
            {
                sales?.map((sale) => {
                    return (
                        <SaleCard
                            key={sale.id}
                            sale={sale}/>
                    )
                })
            }
        </div>
    );
};

export default SalesContainer;

const Skeleton = () => {
    return (
        <div className="flex-1 animate-pulse duration-200 ease-in-out transition-all bg-neutral-200 dark:bg-slate-800 flex min-h-0 min-w-0 rounded-lg"/>
    )
}