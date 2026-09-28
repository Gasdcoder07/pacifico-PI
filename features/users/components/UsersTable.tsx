"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { getUsers } from "../services/users.service";
import { User } from "../types/user";
import { useAuth } from "@/features/auth/hooks/useAuth";

const UsersTable = () => {
    const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300";

    const { user: currentUser } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers
    })

    const rawUsers = data?.data ?? [];

    const users = [...rawUsers].sort((a, b) => {
            if (String(a.id) === String(currentUser?.id)) return -1;
            if (String(b.id) === String(currentUser?.id)) return 1;
            return 0;
        });

    if (isLoading) return <UsersTableSkeleton/>;

    return (
        <div className="bg-white flex flex-col flex-1 min-h-0 min-w-0 border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${scrollbarStyles}`}>

                <table className="w-full">
                    <thead className="bg-white sticky top-0 z-10 text-left text-xs text-neutral-600 tracking-wider uppercase border-b border-neutral-200 whitespace-nowrap">
                        <tr>
                            <th className="px-6 py-3 font-medium">Nombre</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Rol</th>
                            <th className="px-6 py-3 text-right font-medium">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-200">
                        {users.map((user: User) => {
                            const isMe = String(user.id) === String(currentUser?.id);

                            return (
                                <UsersTableRow key={user.id} user={user} isMe={isMe} />
                            );
                        })}
                    </tbody>
                </table>
                
            </div>
        </div>
    );
};

export default UsersTable;

interface UsersTableRowProps {
    user: User;
    isMe: boolean;
}

export const UsersTableRow = ({ user, isMe }: UsersTableRowProps) => {
    return (
        <tr className="text-sm text-neutral-500">
            <td className="px-6 py-4 whitespace-nowrap font-semibold">
                {isMe ? `${user.name} ${user.last_name} (Tú)` : `${user.name} ${user.last_name}`}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <RolSpan rol_id={user.rol_id} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 justify-end">
                    <button className="text-cyan-500 hover:text-cyan-600 cursor-pointer transition-colors ease-in-out duration-200">
                        <Edit size={16} className="shrink-0"/>
                    </button>
                    <button className="text-red-500 hover:text-red-600 cursor-pointer transition-colors ease-in-out duration-200">
                        <Trash size={16} className="shrink-0"/>
                    </button>
                </div>
            </td>
        </tr>
    )
}

interface RolSpanProps {
    rol_id: number | string;
}

export const RolSpan = ({ rol_id } : RolSpanProps) => {
    let label = "";

    if (rol_id === '1') {
        label = 'Administrador';
    } else if (rol_id === '2') {
        label = 'Gerente';
    } else {
        label = 'Cajero';
    }

    return (
        <span className={`shrink-0`}>
            {label}
        </span>
    )
}


export const UsersTableSkeleton = () => {
    return (
        <div className="h-full w-full bg-neutral-200 flex flex-col flex-1 min-h-0 min-w-0 rounded-lg shadow-sm"/>
    )
}