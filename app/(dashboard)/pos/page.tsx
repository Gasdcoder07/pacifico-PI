"use client";

import { useAuth } from "@/hooks/useAuth";

const Page = () => {
    const { user, loading } = useAuth();

    return (
        <section className="p-6">
            <div className="max-w-3xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Punto de venta</p>
                        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Sesión activa</h1>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${loading ? "bg-amber-100 text-amber-700" : user ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {loading ? "Cargando" : user ? "Autenticado" : "Sin sesión"}
                    </span>
                </div>

                {user ? (
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-neutral-500">Nombre</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.nombre} {user.apellido}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Correo</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.correo}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">ID de usuario</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Sucursal</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.sucursal_id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Rol</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.rol_id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-neutral-500">Estado de cuenta</dt>
                            <dd className="mt-1 font-medium text-neutral-900">{user.estado ? "Activa" : "Inactiva"}</dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-5 text-sm text-neutral-600">
                        {loading ? "Obteniendo los datos de la sesión..." : "No se encontró una sesión activa."}
                    </p>
                )}
            </div>
        </section>
    )
};

export default Page;
