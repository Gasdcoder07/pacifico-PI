import { ModalLayout } from "@/shared/components/ModalLayout";

import { useTranslations } from "next-intl";

import { TriangleAlert } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/features/sell/services/product.service";
import { DeleteProductPayload } from "@/features/sell/types/product";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string | null | undefined;
    productId: string | null | undefined;
    branchName: string | null | undefined;
    branchId: string | null | undefined;
}

export const DeleteProductModal = ({ isOpen, onClose, productName, productId, branchName, branchId }: DeleteProductModalProps) => {
    const t = useTranslations("InventoryPage.deleteProductModal");
    const queryClient = useQueryClient();

    const { mutate: mutateDeleteProduct, isPending } = useMutation({
        mutationFn: (data: DeleteProductPayload) => deleteProduct(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:["products"] })

            onClose();
        },

        onError: () => {
            
        }
    })

    const handleDeleteProduct = () => {
        if (productId == null || branchId == null) {
            return;
        }

        mutateDeleteProduct({
            product_id: productId,
            branch_ids: [branchId],
        });
    };

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
                    {t.rich("warningMessage", {
                        productName: productName ?? "",
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
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        {t("cancelButton")}
                    </button>
                    <button
                        onClick={handleDeleteProduct}
                        type="button"
                        className="px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                        {t("confirmButton")}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};
