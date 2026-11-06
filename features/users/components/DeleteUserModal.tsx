import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

import { deleteUser } from "@/features/users/services/users.service";
import { BranchId } from "@/features/branches/types/branch";

import { ModalLayout } from "@/shared/components/ModalLayout";
import { useTranslations } from "next-intl";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    userLastName: string;
    userId: string | number;
    branchId: BranchId;
}

export const DeleteUserModal = ({ isOpen, onClose, userName, userLastName, userId, branchId }: DeleteUserModalProps) => {
    const queryClient = useQueryClient();
    const t = useTranslations("DeleteUserModal");

    const {
        mutate: mutateDeleteUser,
        isPending: isDeleting,
    } = useMutation({
        mutationFn: (id: string | number) => deleteUser(id),

        onSuccess: async () => {
            toast.success(t("toast.success"));

            await queryClient.invalidateQueries({ queryKey: ["getBranch", Number(branchId)] });
            await queryClient.invalidateQueries({ queryKey: ["users"] });

            onClose();
        },

        onError: () => {
            toast.error(t("toast.error"));
        },
    });

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex flex-col items-center justify-center size-14 bg-red-100 border border-red-200 rounded-full mx-auto">
                        <TriangleAlert size={40} className="text-red-500 -translate-y-0.5"/>
                    </div>

                    <h3 className="text-center text-xl font-semibold">{t("title")}</h3>
                </div>

                <p className="text-center text-muted-foreground">
                    {t.rich("description", {
                        userName: `${userName} ${userLastName}`,
                        highlight: (chunks) => (
                        <span className="font-semibold text-neutral-900">
                            {chunks}
                        </span>
                        ),
                    })}
                </p>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
                    >
                        {t("actions.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={() => mutateDeleteUser(userId)}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${
                            isDeleting
                                ? "bg-neutral-600 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 cursor-pointer"
                        }`}
                    >
                        {isDeleting ? t("actions.deleting") : t("actions.delete")}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};