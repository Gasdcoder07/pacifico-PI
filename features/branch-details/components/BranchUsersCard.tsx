"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import CreateUserButton from "@/features/users/components/CreateUserButton";
import UsersCard from "@/features/users/components/UsersCard";
import { getUsers } from "@/features/users/services/users.service";
import { User } from "@/features/users/types/user";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

const BranchUsersCard = () => {
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

    if (isLoading) return <UsersContainerSkeleton/>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h4 className="text-neutral-900 text-xl font-semibold tracking-wide">Equipo de la sucursal</h4>
                    <p className="text-neutral-500 text-sm">Las personas que mantienen tu sucursal.</p>
                </div>

                <CreateUserButton/>
            </div>

            <div className="flex flex-col gap-4">
                {
                    users.length === 0 ? (
                        <EmptyState/>
                    ) : (
                        users.map((user : User) => {
                            const isMe = String(user.id) === String(currentUser?.id);

                            return (
                                <div key={user.id} className="flex items-center gap-4">
                                    <UsersCard user={user} isMe={isMe}/>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    );
};

export default BranchUsersCard;

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="p-4 bg-brand-50 text-brand-600 border border-brand-200 rounded-full">
                <Users size={28} />
            </div>

            <div className="flex max-w-sm flex-col gap-2">
                <h3 className="text-xl font-semibold text-neutral-900">
                    Aún no tienes colaboradores
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600">
                    Todavía no hay personas registradas en esta sucursal.
                    Crea un usuario para comenzar a formar tu equipo.
                </p>
            </div>
        </div>
    );
};

const UsersContainerSkeleton = () => {
    return (
        <div className="h-full w-full bg-neutral-200 flex flex-col flex-1 min-h-0 min-w-0 rounded-lg shadow-sm"/>
    )
}