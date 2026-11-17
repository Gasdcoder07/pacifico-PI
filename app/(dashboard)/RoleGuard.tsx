"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBranchById } from "@/features/branches/services/branch.service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const roleId = Number(user?.rol_id);

    const branchMatch = pathname.match(
        /^\/branch\/(\d+)\/[^/]+\/?$/
    );

    const branchId = branchMatch?.[1] ? Number(branchMatch[1]) : null;
    const isBranchDetails = branchId !== null;

    const {
        data: branchData,
        isPending,
        isSuccess,
        isError
    } = useQuery({
        queryKey: ["getBranch", Number(branchId)],
        queryFn: () => getBranchById(branchId!),
        enabled:
            !loading &&
            !!user &&
            roleId === 1 &&
            isBranchDetails &&
            user.company_id != null,
        staleTime: 60_000,
        retry: false,
    })

    const belongsToCompany =
        user?.company_id != null &&
        branchData?.data?.company_id != null &&
        String(user.company_id) ===
            String(branchData.data.company_id);

    // Cajero: solo puede entrar a /sell
    const isCashierBlocked = roleId === 3 && pathname !== "/sell";

    // Administrador: no puede entrar a /sell
    const isAdminBlocked = roleId === 1 && pathname === "/sell";

    // Gerente: no puede entrar a configuración, listado ni detalles de sucursales
    const isManagerBlocked =
        roleId === 2 &&
        (
            pathname.startsWith("/settings") ||
            pathname.startsWith("/branches") ||
            pathname === "/branch" ||
            pathname.startsWith("/branch/")
        );

    const isUnknownRole = !!user && ![1, 2, 3].includes(roleId);

    const isCheckingBranch =
            isBranchDetails &&
            roleId === 1 &&
            isPending;

        const isForbiddenBranch =
            isBranchDetails &&
            roleId === 1 &&
            (   user?.company_id == null ||
                isError ||
                (isSuccess && !belongsToCompany)
            );

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (isCashierBlocked) {
            router.replace("/sell");
            return;
        }

        if (
            isAdminBlocked ||
            isManagerBlocked ||
            isUnknownRole
        ) {
            router.replace("/sales");
            return;
        }

        if (isForbiddenBranch) {
            router.replace("/branches");
            return;
        }
    }, [user,
        loading,
        router,
        isCashierBlocked,
        isAdminBlocked,
        isManagerBlocked,
        isUnknownRole,
        isForbiddenBranch,]);

    // Retorna null mientras verifica la sesión para evitar parpadeos de vistas no permitidas
    if (
        loading ||
        !user ||
        isCashierBlocked ||
        isAdminBlocked ||
        isManagerBlocked ||
        isUnknownRole ||
        isCheckingBranch ||
        isForbiddenBranch
    ) {
        return null;
    }

    return <>{children}</>;
}