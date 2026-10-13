"use client"

import { getBranchById } from "@/features/branches/services/branch.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const Page = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ["getBranch", id],
        queryFn: () => getBranchById(id),
        enabled: !!id,
    });

    console.log(data);

    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            
        </section>
    )
};

export default Page;
