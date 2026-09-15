import { UserProfile } from "@/types/authInterfaces"

export const DashBoard = ({ user } : { user : UserProfile | null | undefined }) => {

    const formattedInfo = {
        name: user?.nombre ? user?.nombre.charAt(0).toUpperCase() + user?.nombre.slice(1) : "Null",
        apellido: user?.apellido ? user?.apellido.charAt(0).toUpperCase() + user?.apellido.slice(1) : "Null",
        estado: user?.estado === true ? "Activo" : "Inactivo",
        rol: user?.rol_id === 1 ? "Administrador" : (user?.rol_id === 2) ? "Gerente" : (user?.rol_id === 3) ? "Cajero" : null, 
        ...user
    }

    return (
        <section
            className="w-[80%] min-h-10 bg-gray-50 border border-zinc-50 rounded-2xl shadow-2xs p-8"
        >
            <h1>Bienvenido {formattedInfo.name}</h1>
        </section>
    )
}