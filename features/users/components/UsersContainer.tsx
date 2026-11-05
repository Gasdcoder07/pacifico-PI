"use client";

import { User } from "../types/user";
import { UserProfile } from "@/features/auth/types/authInterfaces";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";

import UsersCard from "./UsersCard";

const scrollbarStyles =
    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

interface UsersContainerProps {
    users: User[];
    currentUser?: UserProfile | null;
    isLoading: boolean;
}

const UsersContainer = ({ users = [], currentUser, isLoading } : UsersContainerProps) => {
    if (isLoading) return <UsersContainerSkeleton />;

    return (
        <section className="flex flex-1 min-h-0 min-w-0">
            <div className={`flex-1 min-h-0 overflow-y-auto ${scrollbarStyles}`}>
                {users.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {users.map((user: User) => {
                            const isMe =
                                String(user.id) === String(currentUser?.id);

                            return (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4"
                                >
                                    <UsersCard
                                        user={user}
                                        isMe={isMe}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default UsersContainer;

const EmptyState = () => {
    const t = useTranslations("UsersPage.container.emptyState");

    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="rounded-full border border-brand-200 bg-brand-50 p-4 text-brand-600">
                <Users size={28} />
            </div>

            <div className="flex max-w-sm flex-col gap-2">
                <h3 className="text-xl font-semibold text-neutral-900">
                    {t("title")}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600">
                    {t("description")}
                </p>
            </div>
        </div>
    );
};

export const UsersContainerSkeleton = () => {
    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 shadow-sm w-full" />
    );
};
