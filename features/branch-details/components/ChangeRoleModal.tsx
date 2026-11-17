
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { EditUserPayload, User } from "@/features/users/types/user";
import { updateUser } from "@/features/users/services/users.service";
import { ModalLayout } from "@/shared/components/ModalLayout";

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    branchId: number;
    haveManager: boolean;
}

const ChangeRoleModal = ({
    isOpen,
    onClose,
    user,
    branchId,
    haveManager,
}: ChangeRoleModalProps) => {
    const queryClient = useQueryClient();
    const t = useTranslations(
        "BranchDetails.usersContainer.changeRoleModal"
    );

    const isManager = Number(user.rol_id) === 2;
    const isCashier = Number(user.rol_id) === 3;

    const canChangeRole =
        isManager || (isCashier && !haveManager);

    const newRole = isManager ? 3 : 2;
    const userName = `${user.name} ${user.last_name}`;

    const {
        mutate: mutateUpdateUser,
        isPending: isUpdating,
    } = useMutation({
        mutationFn: (data: EditUserPayload) =>
            updateUser(user.id, data),

        onSuccess: async () => {
            toast.success(t("toast.success"));

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["getBranch", branchId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["users"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["branches"],
                }),
            ]);

            onClose();
        },

        onError: () => {
            toast.error(t("toast.error"));
        },
    });

    const handleConfirm = () => {
        if (isUpdating || !canChangeRole) return;

        const name = user.name?.trim();
        const last_name = user.last_name?.trim();
        const email = user.email?.trim();

        if (!name || !last_name || !email) {
            toast.error(t("toast.requiredFields"));
            return;
        }

        mutateUpdateUser({
            name,
            last_name,
            email,
            rol_id: newRole,
        });
    };

    return (
        <ModalLayout
            isOpen={isOpen}
            onClose={() => {
                if (!isUpdating) onClose();
            }}
        >
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex justify-center items-center rounded-full border border-brand-200 dark:border-cyan-500/30 bg-brand-50 dark:bg-cyan-500/10 p-4 text-brand-600 dark:text-cyan-400">
                        <BriefcaseBusiness size={28} />
                    </div>

                    <h3 className="text-center text-xl font-semibold">
                        {isManager
                            ? t("title.demote")
                            : t("title.promote")}
                    </h3>
                </div>

                <p className="text-center text-muted-foreground">
                    {t.rich(
                        isManager
                            ? "description.demote"
                            : "description.promote",
                        {
                            userName,
                            highlight: (chunks) => (
                                <span className="font-semibold text-neutral-900 dark:text-slate-50">
                                    {chunks}
                                </span>
                            ),
                        }
                    )}
                </p>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
                    >
                        {t("actions.cancel")}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isUpdating || !canChangeRole}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${
                            isUpdating || !canChangeRole
                                ? "bg-neutral-600 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                                : "bg-cyan-400 hover:bg-cyan-500 dark:text-slate-950 cursor-pointer"
                        }`}
                    >
                        {isUpdating
                            ? t("actions.updating")
                            : t("actions.confirm")}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default ChangeRoleModal;
