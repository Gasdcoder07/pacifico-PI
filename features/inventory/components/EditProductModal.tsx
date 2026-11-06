"use client";

import { ModalLayout } from "@/shared/components/ModalLayout";
import { useQueries } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import {
  CreateProductPayload,
  getCategories,
  Category,
} from "../services/inventory.service";
import toast from "react-hot-toast";
import { customStyles, selectThemeVars } from "../utils/styles.select";
import { getBranches } from "@/features/branches/services/branch.service";
import { Branch } from "@/features/branches/types/branch";
import { useTranslations } from "next-intl";
import { Product } from "@/features/sell/types/product";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface BranchStock {
  quantity: string;
  min_stock: string;
}

const initialForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  foto_url: "",
  quantity: "",
  min_stock: "",
};

const PRICE_REGEX = /^\d{1,10}(\.\d{1,2})?$/;
const INT_REGEX = /^\d+$/;
const MAX_INT = 2147483647;

const inputClass =
  "w-full py-2 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out px-3";

const scrollbarStyles =
    "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-600";

const EditProductModalContent = ({ isOpen, onClose, product }: EditProductModalProps) => {
  const t = useTranslations("InventoryPage.editProductModal");

  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    name: product.name,
    description: product.description,
    price: String(product.price),
    category_id: String(product.category_id),
    foto_url: product.foto_url,
  }));
  const [currentStep, setCurrentStep] = useState(1);

  const [imagePreview, setImagePreview] = useState<string | null>(product.foto_url || null);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([
    String(product.branch_id),
  ]);
  const [branchStock, setBranchStock] = useState<Record<string, BranchStock>>(() => ({
    [String(product.branch_id)]: {
      quantity: String(product.quantity),
      min_stock: String(product.min_stock),
    },
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [branchesQuery, categoriesQuery] = useQueries({
    queries: [
      { queryKey: ["branches"], queryFn: getBranches },
      { queryKey: ["categories"], queryFn: getCategories },
    ],
  });

  const handleCategoryChange = (option: SingleValue<Category>) => {
    setFormData((prev) => ({
      ...prev,
      category_id: option ? String(option.id) : "",
    }));
  };

  const handleBranchesChange = (options: MultiValue<Branch>) => {
    const nextBranches = [...options];

    setSelectedBranchIds(nextBranches.map((branch) => String(branch.id)));

    setBranchStock((prev) => {
    const next: Record<string, BranchStock> = {};
    
    for (const branch of nextBranches) {
        const id = String(branch.id);

        next[id] = prev[id] ?? {
                quantity: "",
                min_stock: "",
            };
        }

        return next;
    });
  };

    const handleBranchStockChange = (
        branchId: string,
        field: keyof BranchStock,
        value: string
    ) => {
        setBranchStock((prev) => ({
        ...prev,
        [branchId]: {
            ...(prev[branchId] ?? {
            quantity: "",
            min_stock: "",
            }),
            [field]: value,
        },
        }));
    };

  const branches = branchesQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const selectedBranches = branches.filter((branch) =>
    selectedBranchIds.includes(String(branch.id))
  );
  const selectedCategory =
    categories.find((category) => String(category.id) === formData.category_id) ?? null;

    const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const name = formData.name.trim();
        const price = formData.price.trim();
        const categoryId = formData.category_id;

        if (!name || !price || !categoryId) {
            toast.error(t("notifications.requiredFields"));
            return;
        }

        if (!PRICE_REGEX.test(price)) {
            toast.error(t("notifications.invalidPrice"));
            return;
        }

        setCurrentStep(2);
    };

  const handlePreviousStep = () => {setCurrentStep(1)};

  const resetForm = () => {
    setFormData(initialForm);
    setImagePreview(null);
    setSelectedBranchIds([]);
    setBranchStock({});
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error(t("notifications.invalidFormat"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("notifications.imageSizeError"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, foto_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

    const buildPayload = (): (CreateProductPayload & Pick<Product, "product_id">) | null => {
        const name = formData.name.trim();
        const price = formData.price.trim();

        if (!name || !price || !formData.category_id) {
            toast.error(t("notifications.requiredFields"));
            return null;
        }

        if (!PRICE_REGEX.test(price)) {
            toast.error(t("notifications.invalidPrice"));
            return null;
        }

        if (selectedBranches.length === 0) {
            toast.error(t("notifications.selectBranch"));
            return null;
        }

        for (const branch of selectedBranches) {
            const branchId = String(branch.id);

            const stock = branchStock[branchId];

            const quantity = stock?.quantity.trim() ?? "";
            const minStock = stock?.min_stock.trim() ?? "";

            if (!INT_REGEX.test(quantity) || Number(quantity) > MAX_INT) {
                toast.error(`${branch.name}: ${t("notifications.invalidQuantity")}`);
                return null;
            }

            if (minStock && (!INT_REGEX.test(minStock) || Number(minStock) > MAX_INT)) {
                toast.error(`${branch.name}: ${t("notifications.invalidMinStock")}`);
                return null;
            }
        }

        // Construir inventario individual
        const branchesPayload: CreateProductPayload["branches"] =
        selectedBranches.map((branch) => {
        const branchId = String(branch.id);
        const stock = branchStock[branchId];

        const minStock = stock.min_stock.trim();

        return {
            branch_id: branchId,
            quantity: Number(stock.quantity),

            ...(minStock && {
                min_stock: Number(minStock),
            }),
            };
        });

        return {
            product_id: product.product_id,
            name,
            description: formData.description.trim(),
            price: Number(price),
            category_id: Number(formData.category_id),
            branches: branchesPayload,
            foto_url: formData.foto_url,
        };
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 2) return;

    const payload = buildPayload();

    if (!payload) return;

    console.log("Edit product payload:", payload);
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={handleClose} title={t("title")} width="max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        {
            currentStep === 1 && (
            <div className="flex gap-6 min-h-80">
                <div className="w-2/5 flex flex-col items-center gap-2">
                    <span className="self-start font-medium text-neutral-600 dark:text-slate-400">
                        {t("image.label")} *
                    </span>

                    <div
                    onClick={triggerFileSelect}
                    className="group relative h-full w-full cursor-pointer overflow-hidden rounded-lg border-2 border-neutral-200 dark:border-slate-800 transition-all duration-200 hover:border-cyan-400"
                    >
                        {imagePreview ? (
                            <img
                            src={imagePreview}
                            alt={t("image.previewAlt")}
                            className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-50 dark:bg-slate-800 text-neutral-400 dark:text-slate-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-8 w-8"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                />
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                />
                            </svg>
                        </div>
                        )}

                        {
                            imagePreview && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                {t("image.changeOverlay")}
                            </div>
                            )
                        }
                    </div>

                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    />

                    <button
                    type="button"
                    onClick={triggerFileSelect}
                    className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 cursor-pointer duration-200 ease-in-out transition-all"
                    >
                        {imagePreview ? t("image.changeButton") : t("image.uploadButton")}
                    </button>

                    <span className="text-xs text-neutral-400 dark:text-slate-400">
                        {t("image.requirements")}
                    </span>
                </div>

                <div className="w-3/5 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600 dark:text-slate-400">
                            {t("fields.name.label")} *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t("fields.name.placeholder")}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-neutral-600 dark:text-slate-400">
                            {t("fields.description.label")}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t("fields.description.placeholder")}
                            className={`${inputClass} ${scrollbarStyles} resize-none`}
                            rows={6}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-1 min-w-0 flex-col gap-2">
                            <label className="font-medium text-neutral-600 dark:text-slate-400">
                            {t("fields.category.label")} *
                            </label>

                            <Select
                            maxMenuHeight={120}
                            menuPlacement="auto"
                            className={selectThemeVars}
                            styles={customStyles}
                            options={categories}
                            getOptionLabel={(category: Category) => category.name}
                            getOptionValue={(category: Category) => String(category.id)}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            placeholder={t("fields.category.placeholder")}
                            />
                        </div>
                    
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-neutral-600 dark:text-slate-400">
                                {t("fields.price.label")} *
                            </label>
                            <input
                                type="number"
                                name="price"
                                min={0}
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder={t("fields.price.placeholder")}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )
        }
        {
            currentStep === 2 && (
                <div className="flex flex-col gap-4 min-h-80">
                    <div className="grid grid-cols-1 gap-2">
                        <label className="font-medium text-neutral-600 dark:text-slate-400">
                        {t("fields.branches.label")} *
                        </label>

                        <Select
                        maxMenuHeight={120}
                        menuPlacement="auto"
                        isMulti
                        isSearchable
                        className={selectThemeVars}
                        styles={customStyles}
                        options={branches}
                        getOptionLabel={(branch: Branch) => branch.name}
                        getOptionValue={(branch: Branch) => String(branch.id)}
                        value={selectedBranches}
                        onChange={handleBranchesChange}
                        placeholder={t("fields.branches.placeholder")}
                        />
                    </div>

                    <div className={`h-60 flex flex-col gap-2 overflow-y-auto ${scrollbarStyles}`}>
                        {selectedBranches.map((branch) => {
                            const branchId = String(branch.id);
                            const stock = branchStock[branchId];

                            return (
                            <div
                                key={branchId}
                                className="grid grid-cols-3 items-center gap-4 rounded-lg border border-neutral-200 dark:border-slate-800 px-4 py-3 shadow"
                            >
                                <div className="flex min-w-0 items-center">
                                    <span className="truncate font-medium text-neutral-700 dark:text-slate-300">
                                        {branch.name}
                                    </span>
                                </div>

                                <div className="flex min-w-0 flex-col gap-2">
                                <label
                                    htmlFor={`quantity-${branchId}`}
                                    className="font-medium text-neutral-600 dark:text-slate-400"
                                >
                                    {t("fields.quantity.label")} *
                                </label>

                                <input
                                    id={`quantity-${branchId}`}
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={stock?.quantity ?? ""}
                                    onChange={(e) =>
                                    handleBranchStockChange(
                                        branchId,
                                        "quantity",
                                        e.target.value
                                    )
                                    }
                                    placeholder={t("fields.quantity.placeholder")}
                                    className={inputClass}
                                />
                                </div>

                                <div className="flex min-w-0 flex-col gap-2">
                                <label
                                    htmlFor={`min-stock-${branchId}`}
                                    className="font-medium text-neutral-600 dark:text-slate-400"
                                >
                                    {t("fields.minStock.label")}
                                </label>

                                <input
                                    id={`min-stock-${branchId}`}
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={stock?.min_stock ?? ""}
                                    onChange={(e) =>
                                    handleBranchStockChange(
                                        branchId,
                                        "min_stock",
                                        e.target.value
                                    )
                                    }
                                    placeholder={t("fields.minStock.placeholder")}
                                    className={inputClass}
                                />
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )
        }

        <div className="flex justify-end items-center gap-4">
            <button
            type="button"
            onClick={currentStep === 1 ? handleClose : handlePreviousStep}
            className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-neutral-200 dark:border-slate-800 px-4 py-2 text-neutral-600 dark:text-slate-400 transition-colors duration-200 ease-in-out hover:bg-neutral-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
                {currentStep === 1 ? t("actions.cancel") : t("actions.back")}
            </button>
            
            {
                currentStep === 1 ? (
                    <button
                        key="next-step"
                        type="button"
                        onClick={handleNextStep}
                        className="rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 hover:bg-cyan-500 cursor-pointer">
                            {t("actions.continue")}
                    </button>
                ) : (
                    <button
                    key="edit-product"
                    type="submit"
                    className="rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out cursor-pointer bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 hover:bg-cyan-500"
                    >
                        {t("actions.submit")}
                    </button>
                )
            }
        </div>
      </form>
    </ModalLayout>
  );
};

export const EditProductModal = (props: EditProductModalProps) => (
  <EditProductModalContent
    key={`${props.product.product_id}-${props.product.branch_id}-${props.isOpen}`}
    {...props}
  />
);