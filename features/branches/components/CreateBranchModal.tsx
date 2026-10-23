import { ModalLayout } from "@/shared/components/ModalLayout";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { createBranch, type CreateBranchPayload } from "@/features/branches/services/branch.service";

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm = {
  company_name: "",
  company_description: "",
  company_address: "",
  company_phone: "",
};

export const CreateBranchModal = ({ isOpen, onClose }: CreateBranchModalProps) => {
  const t = useTranslations("Branches.createModal");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialForm);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const { mutate: mutateCreateBranch, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateBranchPayload) => createBranch(data),

    onSuccess: () => {
      toast.success(t("notifications.success"));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      resetForm();
      onClose();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.error || t("notifications.error"));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(t("notifications.invalidImageFormat"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("notifications.imageSizeError"));
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.company_name.trim() ||
      !formData.company_address.trim() ||
      !formData.company_phone.trim()
    ) {
      toast.error(t("notifications.requiredFields"));
      return;
    }

    mutateCreateBranch({
      name: formData.company_name.trim(),
      direction: formData.company_address.trim(),
      phone: formData.company_phone.trim(),
      contact_info: formData.company_description.trim(),
    });
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={handleClose} title={t("title")}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
        {/* Sección para subir/cambiar foto */}
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

            {/* Overlay de hover "Cambiar foto" */}
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

        {/* Campos de texto */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
            {t("fields.name.label")} *
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder={t("fields.name.placeholder")}
            className="w-full rounded-lg border border-neutral-200 p-3 outline-none transition-colors duration-200 ease-in-out focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
            {t("fields.description.label")}
          </label>
          <input
            type="text"
            name="company_description"
            value={formData.company_description}
            onChange={handleInputChange}
            placeholder={t("fields.description.placeholder")}
            className="w-full rounded-lg border border-neutral-200 p-3 outline-none transition-colors duration-200 ease-in-out focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
            {t("fields.address.label")} *
          </label>
          <input
            type="text"
            name="company_address"
            value={formData.company_address}
            onChange={handleInputChange}
            placeholder={t("fields.address.placeholder")}
            className="w-full rounded-lg border border-neutral-200 p-3 outline-none transition-colors duration-200 ease-in-out focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-neutral-600">
            {t("fields.phone.label")} *
          </label>
          <input
            type="tel"
            name="company_phone"
            value={formData.company_phone}
            onChange={handleInputChange}
            placeholder={t("fields.phone.placeholder")}
            className="w-full rounded-lg border border-neutral-200 p-3 outline-none transition-colors duration-200 ease-in-out focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5"
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
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
