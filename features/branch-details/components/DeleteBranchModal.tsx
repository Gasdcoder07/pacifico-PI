import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteBranch } from "@/features/branches/services/branch.service";
import { ModalLayout } from "@/shared/components/ModalLayout";

import { TriangleAlert } from "lucide-react";
import { Branch } from "@/features/branches/types/branch";
import { useTranslations } from "next-intl";

interface DeleteBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branchName: string | null | undefined;
    branchId: string | number | null | undefined;
}

export const DeleteBranchModal = ({ isOpen, onClose, branchName, branchId }: DeleteBranchModalProps) => {
    const t = useTranslations("BranchDetails.deleteBranchModal");
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        mutate: mutateDeleteBranch,
        isPending: isDeleting,
    } = useMutation({
        mutationFn: (id: string | number) => deleteBranch(id),

        onSuccess: () => {
            queryClient.setQueriesData<Branch[]>(
                { queryKey: ["branches"] },
                (oldData) =>
                    oldData?.filter(
                        (branch) => Number(branch.id) !== Number(branchId)
                    )
            );

            toast.success(t("notifications.success"));
            onClose();
            router.push("/branches");

            queryClient.invalidateQueries({ queryKey: ["branches"] });
        },

        onError: () => {
            toast.error(t("notifications.error"));
        },
    });

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex flex-col items-center justify-center size-14 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-full mx-auto">
                        <TriangleAlert size={40} className="text-red-500 dark:text-red-400 -translate-y-0.5"/>
                    </div>

                    <h3 className="text-center text-xl font-semibold">{t("title")}</h3>
                </div>

                <p className="text-center text-muted-foreground">
                    {t.rich("description", {
                        branchName: branchName ?? "",
                        highlight: (chunks) => (
                        <span className="font-semibold text-neutral-900 dark:text-slate-50">
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
                        className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        {t("actions.cancel")}
                    </button>
                    <button
                        disabled={isDeleting || branchId === null}
                        onClick={() => {
                            if (branchId == null) return;
                            mutateDeleteBranch(Number(branchId));
                        }}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${
                            isDeleting
                                ? "bg-neutral-600 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
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
