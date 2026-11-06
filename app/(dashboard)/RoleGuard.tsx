"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (loading || !user) return;

        const roleId = Number(user.rol_id);

        // 1. CAJERO (Rol 3): Solo acceso a /sell
        if (roleId === 3 && pathname !== "/sell") {
            router.replace("/sell");
            return;
        }

        // 2. ADMINISTRADOR (Rol 1): Acceso a todo excepto /sell -> Redirige a /sales
        if (roleId === 1 && pathname === "/sell") {
            router.replace("/sales");
            return;
        }

        // 3. GERENTE (Rol 2): Acceso a todo excepto /settings y /branches -> Redirige a /sales
        if (
            roleId === 2 &&
            (pathname.startsWith("/settings") || pathname.startsWith("/branches"))
        ) {
            router.replace("/sales");
            return;
        }
    }, [user, loading, pathname, router]);

    // Retorna null mientras verifica la sesión para evitar parpadeos de vistas no permitidas
    if (loading) {
        return null;
    }

    return <>{children}</>;
}