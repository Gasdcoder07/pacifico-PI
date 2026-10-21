import { ModalLayout } from "@/shared/components/ModalLayout";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select"
import { createProduct, CreateProductPayload, getCategories } from "../services/inventory.service";
import toast from "react-hot-toast";
import { customStyles } from "../utils/styles.select";
import { Category } from "../services/inventory.service";
import { getBranches } from "@/features/branches/services/branch.service";
import { Branch } from "@/features/branches/types/branch";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  foto_url: ""
};

export const CreateProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialForm);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [branchesQuery, categoriesQuery] = useQueries({
    queries: [
      { queryKey: ["branches"], queryFn: getBranches }, 
      { queryKey: ["categories"], queryFn: getCategories }, 
    ]
  })

  const handleCategoryChange = (option: SingleValue<Category>) => {
    setSelectedCategory(option);
    setFormData((prev) => ({
      ...prev,
      category_id: option ? String(option.id) : ""
    }))
  }

  const handleBranchesChange = (options: MultiValue<Branch>) => {
    setSelectedBranches([...options])
  }

  const branches = branchesQuery.data || []
  const categories = categoriesQuery.data || []

  const resetForm = () => {
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const { mutate: mutateCreateProduct, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateProductPayload) => createProduct(data),
    onSuccess: () => { 
      toast.success("Producto creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error al crear producto");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG o PNG");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no puede pesar más de 2 MB.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.foto_url.trim() || !formData.category_id || !formData.price) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    mutateCreateProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
        foto_url: formData.foto_url,
        branches: selectedBranches
      });
    };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      title={"Ingresa un nuevo producto"}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 bg-neutral-50 p-2 rounded-xl border border-dashed border-neutral-200">
          <span className="font-medium text-neutral-600 self-start">Foto del producto</span>
          <div
            onClick={triggerFileSelect}
            className="relative group w-12 h-12 rounded-full border-2 border-neutral-200 overflow-hidden cursor-pointer hover:border-cyan-400 transition-all duration-200"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Previsualización"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Cambiar foto
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
            {imagePreview ? "Elegir otra imagen" : "Subir imagen"}
          </button>
          <span className="text-[10px] text-neutral-400">Formatos permitidos: JPG, PNG. Máx 2MB.</span>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium text-neutral-600">Nombre del producto *</label>
          <input
            type="text"
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ej. Producto A"
            className="w-full py-2 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out px-3"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium text-neutral-600">Descripción</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Ej. Producto de alta calidad"
            className="w-full py-2 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out px-3"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium text-neutral-600">Precio *</label>
          <input
            type="number"
            name="price" 
            value={formData.price || ""}
            onChange={handleInputChange}
            placeholder="Ej. 100"
            className="w-full py-2 rounded-lg border border-neutral-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 outline-none transition-colors duration-200 ease-in-out px-3"
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-col gap-2 mt-4 w-1/2">
            <label className="font-medium text-neutral-600">Categoría *</label>
            <Select 
              styles={customStyles}
              options={categories}
              getOptionLabel={(category) => category.name}
              getOptionValue={(category) => String(category.id) }
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Categoría"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4 w-1/2">
            <label className="font-medium text-neutral-600">Sucursales *</label>
            <Select 
              isMulti
              isSearchable
              styles={customStyles}
              options={branches}
              getOptionLabel={(branch) => branch.name}
              getOptionValue={(branch) => String(branch.id) }
              value={selectedBranches}
              onChange={handleBranchesChange}
              placeholder="1 o más sucursales"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ease-in-out duration-200 ${
              isCreating
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-cyan-400 hover:bg-cyan-500 cursor-pointer"
            }`}
          >
            {isCreating ? "Creando producto..." : "Crear producto"}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};