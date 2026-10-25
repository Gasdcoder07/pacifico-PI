"use client";

import { ModalLayout } from "@/shared/components/ModalLayout";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import {
  createProduct,
  CreateProductPayload,
  getCategories,
  Category,
} from "../services/inventory.service";
import toast from "react-hot-toast";
import { customStyles } from "../utils/styles.select";
import { Branch, getBranches } from "@/features/branches/services/branch.service";
import { useTranslations } from "next-intl";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  "w-full py-2 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out px-3";

export const CreateProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const t = useTranslations("InventoryPage.addProductModal");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialForm);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [branchesQuery, categoriesQuery] = useQueries({
    queries: [
      { queryKey: ["branches"], queryFn: getBranches },
      { queryKey: ["categories"], queryFn: getCategories },
    ],
  });

  const handleCategoryChange = (option: SingleValue<Category>) => {
    setSelectedCategory(option);
    setFormData((prev) => ({
      ...prev,
      category_id: option ? String(option.id) : "",
    }));
  };

  const handleBranchesChange = (options: MultiValue<Branch>) => {
    setSelectedBranches([...options]);
  };

  const branches = branchesQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const resetForm = () => {
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview(null);
    setSelectedCategory(null);
    setSelectedBranches([]);
  };

  const { mutate: mutateCreateProduct, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateProductPayload) => createProduct(data),
    onSuccess: () => {
      toast.success(t("notifications.success"));
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || t("notifications.error"));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(t("notifications.invalidFormat"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("notifications.imageSizeError"));
      return;
    }

    setImageFile(file);

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
    if (isCreating) return;
    resetForm();
    onClose();
  };

  const buildPayload = (): CreateProductPayload | null => {
    const name = formData.name.trim();
    const price = formData.price.trim();
    const quantity = formData.quantity.trim() || "0";
    const minStock = formData.min_stock.trim();

    if (!name || !price || !formData.category_id) {
      toast.error(t("notifications.requiredFields"));
      return null;
    }

    if (!PRICE_REGEX.test(price)) {
      toast.error(t("notifications.invalidPrice"));
      return null;
    }

    if (!INT_REGEX.test(quantity) || Number(quantity) > MAX_INT) {
      toast.error(t("notifications.invalidQuantity"));
      return null;
    }

    if (minStock && (!INT_REGEX.test(minStock) || Number(minStock) > MAX_INT)) {
      toast.error(t("notifications.invalidMinStock"));
      return null;
    }

    if (selectedBranches.length === 0) {
      toast.error(t("notifications.selectBranch"));
      return null;
    }

    const branchesPayload: CreateProductPayload["branches"] = selectedBranches.map(
      (branch) => ({
        branch_id: String(branch.id),
        quantity: Number(quantity),
        ...(minStock && { min_stock: Number(minStock) }),
      })
    );

    return {
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
    const payload = buildPayload();
    if (payload) mutateCreateProduct(payload);
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={handleClose} title={t("title")}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-2">
          <span className="self-start font-medium text-neutral-600">
            {t("image.label")}
          </span>
          <div
            onClick={triggerFileSelect}
            className="group relative h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 border-neutral-200 transition-all duration-200 hover:border-cyan-400"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={t("image.previewAlt")}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-100 text-neutral-400">
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

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {t("image.changeOverlay")}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png"
            className="hidden"
          />

          <button
            type="button"
            onClick={triggerFileSelect}
            className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
          >
            {imagePreview ? t("image.changeButton") : t("image.uploadButton")}
          </button>
          <span className="text-[10px] text-neutral-400">
            {t("image.requirements")}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
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

        <div className="mt-4 flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
            {t("fields.description.label")}
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t("fields.description.placeholder")}
            className={inputClass}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
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

        <div className="flex flex-row justify-between gap-2">
          <div className="mt-4 flex w-1/2 flex-col gap-2">
            <label className="font-medium text-neutral-600">
              {t("fields.quantity.label")}
            </label>
            <input
              type="number"
              name="quantity"
              min={0}
              step={1}
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder={t("fields.quantity.placeholder")}
              className={inputClass}
            />
          </div>
          <div className="mt-4 flex w-1/2 flex-col gap-2">
            <label className="font-medium text-neutral-600">
              {t("fields.minStock.label")}
            </label>
            <input
              type="number"
              name="min_stock"
              min={0}
              step={1}
              value={formData.min_stock}
              onChange={handleInputChange}
              placeholder={t("fields.minStock.placeholder")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-row justify-between gap-2">
          <div className="mt-4 flex w-1/2 flex-col gap-2">
            <label className="font-medium text-neutral-600">
              {t("fields.category.label")} *
            </label>
            <Select
              styles={customStyles}
              options={categories}
              getOptionLabel={(category: Category) => category.name}
              getOptionValue={(category: Category) => String(category.id)}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder={t("fields.category.placeholder")}
            />
          </div>
          <div className="mt-4 flex w-1/2 flex-col gap-2">
            <label className="font-medium text-neutral-600">
              {t("fields.branches.label")} *
            </label>
            <Select
              isMulti
              isSearchable
              styles={customStyles}
              options={branches as any}
              getOptionLabel={(branch: any) => branch.name}
              getOptionValue={(branch: any) => String(branch.id)}
              value={selectedBranches}
              onChange={handleBranchesChange}
              placeholder={t("fields.branches.placeholder")}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className="cursor-pointer rounded-lg border border-neutral-200 px-4 py-2 text-neutral-600 transition-colors duration-200 ease-in-out hover:bg-neutral-50 disabled:opacity-50"
          >
            {t("actions.cancel")}
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={`rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 ease-in-out ${
              isCreating
                ? "cursor-not-allowed bg-neutral-400"
                : "cursor-pointer bg-cyan-400 hover:bg-cyan-500"
            }`}
          >
            {isCreating ? t("actions.submitting") : t("actions.submit")}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};