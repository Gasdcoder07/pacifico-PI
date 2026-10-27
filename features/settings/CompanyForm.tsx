"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Save, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const inputClass =
  "w-full p-3 text-sm border border-neutral-200 rounded-xl hover:border-neutral-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-colors duration-200 ease-in-out";

const CompanyForm = () => {
  const t = useTranslations("SettingsPage.companyForm");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("logo.notifications.invalidType"));
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error(t("logo.notifications.sizeError"));
      return;
    }

    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos:", formData, "Logo:", logoFile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-4xl flex-col gap-6 rounded-lg border border-neutral-200 bg-white px-8 py-6 shadow-sm"
    >
      {/* Encabezado de la tarjeta */}
      <div className="flex flex-col gap-2 border-b border-neutral-200 pb-6">
        <h2 className="text-xl font-semibold">{t("cardTitle")}</h2>
        <p className="text-sm text-neutral-500">{t("cardSubtitle")}</p>
      </div>

      <div className="flex">
        {/* Columna izquierda: logo */}
        <div className="flex flex-col gap-4 border-r border-neutral-200 pr-8">
          <div className="flex flex-col gap-2">
            <label className="font-medium">{t("logo.label")}</label>
            <p className="text-xs text-neutral-500">{t("logo.hint")}</p>
          </div>

          <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {logoPreview ? (
              <>
                <img
                  src={logoPreview}
                  alt={t("logo.alt")}
                  className="h-full w-full object-contain p-2"
                />

                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full border border-red-50 bg-white text-red-500 shadow-sm transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                  <ImagePlus size={24} strokeWidth={1.6} />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {t("logo.noLogo")}
                  </span>

                  <p className="text-xs text-neutral-400">
                    {t("logo.noLogoHint")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="truncate text-sm font-medium">
              {logoFile ? logoFile.name : t("logo.noFileSelected")}
            </span>
            <div className="flex gap-2">
              <span className="text-xs text-neutral-500">
                {t("logo.requirementsSize")}
              </span>
              <span className="text-xs text-neutral-500">
                {t("logo.requirementsDimensions")}
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <Upload size={16} />
              {t("logo.uploadButton")}
            </button>
          </div>
        </div>

        {/* Columna derecha: nombre y domicilio */}
        <div className="flex flex-col gap-6 pl-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium">
                {t("fields.name.label")}
              </label>
              <p className="text-xs text-neutral-500">
                {t("fields.name.hint")}
              </p>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t("fields.name.placeholder")}
              value={formData.name}
              onChange={handleChange}
              suppressHydrationWarning
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="font-medium">
                {t("fields.address.label")}
              </label>
              <p className="text-xs text-neutral-400">
                {t("fields.address.hint")}
              </p>
            </div>
            <textarea
              id="address"
              name="address"
              placeholder={t("fields.address.placeholder")}
              rows={4}
              value={formData.address}
              onChange={handleChange}
              suppressHydrationWarning
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Descripción a todo el ancho */}
      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-medium">
            {t("fields.description.label")}
          </label>
          <p className="text-xs text-neutral-500">
            {t("fields.description.hint")}
          </p>
        </div>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={250}
          value={formData.description}
          onChange={handleChange}
          placeholder={t("fields.description.placeholder")}
          suppressHydrationWarning
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Pie con el botón */}
      <div className="flex justify-end border-t border-neutral-200 pt-6">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          <Save size={16} />
          {t("submitButton")}
        </motion.button>
      </div>
    </form>
  );
};

export default CompanyForm;