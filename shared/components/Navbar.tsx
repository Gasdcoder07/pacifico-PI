"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import ProfilePfp from "@/shared/components/ProfilePfp";
import BusinessContext from "./BusinessContext";

const Navbar = () => {
    const { user, loading } = useAuth();
    const fullName = user ? `${user.name} ${user.last_name}` : "Cargando...";

    return (
        <nav className="bg-white border-b border-neutral-300">
            <div className="mx-auto flex justify-between items-center py-3 px-4">
                <BusinessContext
                    role={user?.rol_id}
                    companyImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy45ZDId1LatgF6AFZ32E9FTi90TIyVy7Ag7Y8J9eOQg&s=10"
                    contextName={user?.context_name}
                    loading={loading}
                    />

                <div className="flex justify-center items-center gap-4">
                    <ProfilePfp
                        name={fullName || "Usuario"}
                        role={user?.rol_id || null}
                        avatar={user ? user.foto_url : ""}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
