"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const roleId = Number(user?.rol_id);

    const isBranchRoute = pathname === "/branch" || pathname.startsWith("/branch/");

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
    }, [user,
        loading,
        router,
        isCashierBlocked,
        isAdminBlocked,
        isManagerBlocked,
        isUnknownRole,]);

    // Retorna null mientras verifica la sesión para evitar parpadeos de vistas no permitidas
    if (
        loading ||
        !user ||
        isCashierBlocked ||
        isAdminBlocked ||
        isManagerBlocked ||
        isUnknownRole
    ) {
        return null;
    }

    return <>{children}</>;
}