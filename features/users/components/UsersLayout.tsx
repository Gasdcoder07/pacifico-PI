"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

import PageHeader from "./PageHeader";
import UsersContainer from "./UsersContainer";
import { getBranches } from "@/features/branches/services/branch.service";

const UsersLayout = () => {
    const { user: currentUser } = useAuth();
    
    const isAdmin = currentUser?.rol_id === 1;

    const { data, isPending: isUsersPending } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const { data: branches = [], isPending: isBranchesPending } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
        enabled: isAdmin,
        staleTime: 5 * 60 * 1000
    });

    const rawUsers = data?.data ?? [];

    const users = rawUsers.filter((user) => String(user.id) !== String(currentUser?.id))
        .sort((a, b) =>
            Number(b.rol_id) === 2 ? 1 : Number(a.rol_id) === 2 ? -1 : 0,
        );

    const hasBranches = !isAdmin || branches.length > 0;
    const canCreateUser = !isAdmin || (hasBranches && !isBranchesPending);

    const isLoading = isUsersPending || (isAdmin && isBranchesPending);

    return (
        <section className="h-full min-h-0 flex flex-col p-8 gap-8">
            <PageHeader
                currentUser={currentUser}
                canCreateUsers={canCreateUser}/>

            <UsersContainer
                users={users}
                isLoading={isLoading}
                isAdmin={isAdmin}
                hasBranches={hasBranches}/>
        </section>
    );
};

export default UsersLayout;
