import { SlideOverPanelLayout } from "@/shared/components/SlideOverPanelLayout";
import { useTranslations } from "next-intl";

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";

interface CategoriesPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-600";

const CategoriesPanel = ({ isOpen, onClose } : CategoriesPanelProps) => {
    const t = useTranslations("InventoryPage.categoriesPanel");

    return (
        <SlideOverPanelLayout isOpen={isOpen} onClose={onClose} title={t("title")}>
            <div className="flex-1 flex flex-col gap-6 justify-between min-h-0 h-full">
                <CreateCategoryForm/>

                <div className={`flex-1 flex flex-col min-h-0 h-full p-6 gap-4 overflow-y-auto ${scrollbarStyles}`}>

                </div>
            </div>
        </SlideOverPanelLayout>
    );
};

export default CategoriesPanel;