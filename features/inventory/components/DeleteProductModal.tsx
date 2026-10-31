import { ModalLayout } from "@/shared/components/ModalLayout";

import { useTranslations } from "next-intl";

import { TriangleAlert } from "lucide-react";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string | null | undefined;
}

export const DeleteProductModal = ({ isOpen, onClose, productName }: DeleteProductModalProps) => {
    const t = useTranslations("InventoryPage.deleteProductModal");
    
    

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
                    {t("warningMessage")} <span className="font-semibold text-neutral-900">{productName}</span>?
                </p>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer"
                    >
                        {t("cancelButton")}
                    </button>
                    <button
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
