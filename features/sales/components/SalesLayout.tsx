"use client";

import { useQuery } from "@tanstack/react-query";
import { getSales } from "../services/sales.services";
import { useAuth } from "@/features/auth/hooks/useAuth";

import SalesContainer from "./SalesContainer";
import PageHeader from "./PageHeader";

const SalesLayout = () => {
    const { user: currentUser } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["getSales"],
        queryFn: getSales
    });

    const sales = data?.ventas;

    return (
        <section className="h-full flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            <PageHeader
                currentUser={currentUser}/>

            <SalesContainer
                sales={sales}
                isLoading={isLoading}/>
        </section>
    );
};

export default SalesLayout;
