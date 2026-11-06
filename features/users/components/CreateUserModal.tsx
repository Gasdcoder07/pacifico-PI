import { CustomSelect } from "@/shared/components/CustomSelect";
import { ModalLayout } from "@/shared/components/ModalLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { createManager, createCashier } from "../services/users.service";
import { CreateUserRequest } from "../types/user";
import { getBranches } from "@/features/branches/services/branch.service";
import toast from "react-hot-toast";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch_id?: string | number | null | undefined;
  company_id: string | number | null | undefined;
  managerExists?: boolean;
  showBranchSelect: boolean;
}

interface Branch {
  id: number | string;
  name: string;
  gerentes?: unknown[];
}

export const CreateUserModal = ({
  isOpen,
  onClose,
  branch_id,
  company_id,
  managerExists,
  showBranchSelect
}: CreateUserModalProps) => {
  const t = useTranslations("BranchDetails.createUserModal");
  const queryClient = useQueryClient();

  const {
    data: branches,
    error: branchError,
    isLoading: branchIsLoading,
  } = useQuery({
    queryKey: ["getBranches"],
    queryFn: () => getBranches(),
    staleTime: 1000 * 60 * 60,
    retry: false,
    enabled: isOpen,
  });

  const customOptions = managerExists
    ? [{ value: "3", label: t("roles.cashier") }]
    : [
        { value: "2", label: t("roles.manager") },
        { value: "3", label: t("roles.cashier") },
      ];

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    rol_id: "",
    branch_id: branch_id ? String(branch_id) : "",
    company_id: company_id ?? "",
  });

  const branchList: Branch[] = useMemo(() => branches ?? [], [branches]);

  const branchOptions = useMemo(() => {
    const available =
      formData.rol_id === "2"
        ? branchList.filter((branch) => (branch.gerentes?.length ?? 0) === 0)
        : branchList;

    return available.map((branch) => ({
      value: String(branch.id),
      label: branch.name,
    }));
  }, [branchList, formData.rol_id]);

  const handleRoleChange = (value: string) => {
    setFormData((prev) => {
      const selected = branchList.find(
        (branch) => String(branch.id) === prev.branch_id
      );
      const invalid =
        value === "2" && !!selected && (selected.gerentes?.length ?? 0) > 0;

      return {
        ...prev,
        rol_id: value,
        branch_id: invalid ? "" : prev.branch_id,
      };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateUserRequest) => {
      if (String(data.rol_id) === "2") {
        return createManager(data);
      }

      if (String(data.rol_id) === "3") {
        return createCashier(data);
      }

      throw new Error(t("errors.invalidRole"));
    },

    onSuccess: async (_, variables) => {
        if (showBranchSelect) {
            await queryClient.invalidateQueries({
                queryKey: ["users"]
            });
        } else {
            await queryClient.invalidateQueries({
              queryKey: ["getBranch", Number(variables.branch_id)],
            });
            await queryClient.invalidateQueries({ queryKey: ["getBranches"] });
        }

        toast.success(t("notifications.success"));

      setFormData({
        name: "",
        last_name: "",
        email: "",
        rol_id: "",
        branch_id: branch_id ? String(branch_id) : "",
        company_id: company_id ?? "",
      });

      onClose();
    },

    onError: (error: any) => {
        toast.error(t("notifications.error"));
      console.error(
        "Error al crear usuario:",
        error.response?.data ?? error.message
      );
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.branch_id || !formData.rol_id) {
      return;
    }

    mutate({
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      rol_id: formData.rol_id,
      branch_id: Number(formData.branch_id),
      company_id: formData.company_id,
    });
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title={t("title")}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="font-medium text-neutral-600 dark:text-slate-400">
              {t("fields.name.label")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("fields.name.placeholder")}
              className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label className="font-medium text-neutral-600 dark:text-slate-400">
              {t("fields.lastName.label")} *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder={t("fields.lastName.placeholder")}
              className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-neutral-600 dark:text-slate-400">
            {t("fields.email.label")} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("fields.email.placeholder")}
            className="w-full p-3 rounded-lg border border-neutral-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/5 dark:focus:ring-cyan-400/20 outline-none transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className={`flex gap-4 ${showBranchSelect
            ? 'w-full'
            : 'w-1/2'
        }`}>
          <CustomSelect
            isDisabled={false}
            label={t("fields.role.label")}
            placeholder={t("fields.role.placeholder")}
            options={customOptions}
            value={formData.rol_id}
            onChange={handleRoleChange}
          />

          {
            showBranchSelect && (
                <CustomSelect
                  isDisabled={branchIsLoading || !!branchError}
                  label={t("fields.branch.label")}
                  placeholder={t("fields.branch.placeholder")}
                  options={branchOptions}
                  value={String(formData.branch_id)}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, branch_id: value }))
                  }
                />
            )
          }
        </div>

        {branchError && (
          <span className="text-xs text-red-500 dark:text-red-400">
            No se pudieron cargar las sucursales
          </span>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors ease-in-out duration-200 cursor-pointer disabled:opacity-50"
          >
            {t("actions.cancel")}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ease-in-out ${
              isPending
                ? "bg-neutral-600 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                : "bg-cyan-400 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 hover:bg-cyan-500 cursor-pointer"
            }`}
          >
            {isPending ? t("actions.saving") : t("actions.save")}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};