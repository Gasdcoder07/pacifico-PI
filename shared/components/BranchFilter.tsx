
"use client";

import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getBranches } from "@/features/branches/services/branch.service";
import {
    customStyles,
    selectThemeVars,
} from "@/features/inventory/utils/styles.select";

interface BranchFilterProps {
    value: string;
    onChange: (value: string) => void;
}

interface SelectOption {
    value: string;
    label: string;
}

const BranchFilter = ({ value, onChange }: BranchFilterProps) => {
    const t = useTranslations("filters");

    const {
        data: branches = [],
        isLoading,
    } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
        staleTime: 5 * 60_000,
    });

    const branchOptions: SelectOption[] = [
        {
            value: "",
            label: t("allBranches"),
        },
        ...branches.map((branch) => ({
            value: String(branch.id),
            label: branch.name,
        })),
    ];

    const selectedBranch =
        branchOptions.find(
            (option) => option.value === value
        ) ?? null;

    return (
        <div className="min-w-44 text-sm">
            <Select<SelectOption, false>
                isMulti={false}
                maxMenuHeight={160}
                menuPlacement="auto"
                menuPosition="fixed"
                menuPortalTarget={
                    typeof document !== "undefined"
                        ? document.body
                        : undefined
                }
                className={`${selectThemeVars} text-sm`}
                classNames={{
                    menuPortal: () => `${selectThemeVars} text-sm`,
                }}
                styles={{
                    ...customStyles,
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                    }),
                }}
                options={branchOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                value={selectedBranch}
                onChange={(option) =>
                    onChange(option?.value ?? "")
                }
                placeholder={t("allBranches")}
                isLoading={isLoading}
                isDisabled={isLoading}
                isSearchable
            />
        </div>
    );
};

export default BranchFilter;
