"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSales } from "../services/sales.services";
import { useAuth } from "@/features/auth/hooks/useAuth";

import SalesContainer from "./SalesContainer";
import PageHeader from "./PageHeader";
import { useState } from "react";

const PAGE_SIZE = 10;

const SalesLayout = () => {
    const { user: currentUser } = useAuth();
    const [page, setPage] = useState(1);

    const {
        data, isPending,
        isFetching, isPlaceholderData
    } = useQuery({
        queryKey: ["getSales", page, PAGE_SIZE],
        queryFn: () => getSales(page, PAGE_SIZE),
    });

    const sales = data?.ventas ?? [];
    const totalPages = data?.paginacion.total_paginas ?? 1;

    const handlePageChange = (nextPage: number) => {
        if (isFetching || nextPage < 1 || nextPage > totalPages) {
            return;
        }

        setPage(nextPage);
    };

    return (
        <section className="h-full flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            <PageHeader
                currentUser={currentUser}/>

            <SalesContainer
                sales={sales}
                isLoading={isPending}
                isFetching={isFetching}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}/>
        </section>
    );
};

export default SalesLayout;
