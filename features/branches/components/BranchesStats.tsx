"use client";

import { useQuery } from "@tanstack/react-query";
import TopBranchCard from "./TopBranchCard";
import TopBranchesCard from "./TopBranchesCard";
import { getBranches } from "../services/branch.service";
import { useMemo } from "react";

const BranchesStats = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });

    // Ordenar de mayor a menor ganancia
    const sortedBranches = useMemo(() => {
        return [...(data ?? [])].sort(
            (a, b) => Number(b.ganancias) - Number(a.ganancias)
        );
    }, [data]);

    // Sucursal con mayor ganancia
    const topBranch = sortedBranches[0];

    // Las 3 sucursales con mayor ganancia
    const topBranches = sortedBranches.slice(0, 3);

    return (
        <div className="flex items-stretch gap-8">
            <TopBranchCard
                isLoading={isLoading}
                branch={topBranch}/>

            <TopBranchesCard
                isLoading={isLoading}
                branches={topBranches}/>
        </div>
    );
};

export default BranchesStats;
