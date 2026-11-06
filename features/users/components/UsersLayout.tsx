"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

import PageHeader from "./PageHeader";
import UsersContainer from "./UsersContainer";

const UsersLayout = () => {
    const { user: currentUser } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const rawUsers = data?.data ?? [];

    const users = rawUsers.filter((user) => String(user.id) !== String(currentUser?.id))
        .sort((a, b) =>
            Number(b.rol_id) === 2 ? 1 : Number(a.rol_id) === 2 ? -1 : 0,
        );
    
    const isAdmin = currentUser?.rol_id === 1;

    return (
        <section className="h-full min-h-0 flex flex-col p-8 gap-8">
            <PageHeader
                currentUser={currentUser}/>

            <UsersContainer
                users={users}
                isLoading={isLoading}
                isAdmin={isAdmin}/>
        </section>
    );
};

export default UsersLayout;
