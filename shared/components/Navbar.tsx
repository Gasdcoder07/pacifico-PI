"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import ProfilePfp from "@/shared/components/ProfilePfp";

const Navbar = () => {
    const { user, loading } = useAuth();
    const fullName = user ? `${user.name} ${user.last_name}` : "Cargando...";

    return (
        <nav className="bg-white border-b border-neutral-300">
            <div className="mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center gap-4">
                    <img
                        src="https://cdn.aglty.io/scotia-bank-mexico/Attachments/NewItems/lomas-palmas-sucursal_20231018233625_0.png"
                        className="w-10 h-auto shrink-0 object-contain rounded-md"
                        alt="Sucursal"/>

                    <div className="flex flex-col">
                        <p className="text-neutral-500 text-xs font-medium whitespace-nowrap">Sucursal</p>
                        <p className="text-sm font-semibold whitespace-nowrap">
                            {loading ? "Cargando..." : `Sucursal de ${fullName ? fullName : 'el pana'} `}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ProfilePfp
                        name={fullName}
                        role={user ? `Rol ${user.rol_id}` : ""}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
