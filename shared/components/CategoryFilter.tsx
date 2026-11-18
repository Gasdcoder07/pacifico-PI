
"use client";

import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getCategories } from "@/features/inventory/services/inventory.service";
import {
    customStyles,
    selectThemeVars,
} from "@/features/inventory/utils/styles.select";

interface CategoryFilterProps {
    value: string;
    onChange: (value: string) => void;
}

interface SelectOption {
    value: string;
    label: string;
}

const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
    const t = useTranslations("filters");

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 5 * 60_000,
    });

    const categoryOptions: SelectOption[] = [
        {
            value: "",
            label: t("allCategories"),
        },
        ...categories.map((category) => ({
            value: String(category.id),
            label: category.name,
        })),
    ];

    const selectedCategory =
        categoryOptions.find(
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
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                value={selectedCategory}
                onChange={(option) =>
                    onChange(option?.value ?? "")
                }
                placeholder={t("allCategories")}
                isLoading={isLoading}
                isDisabled={isLoading}
                isSearchable
            />
        </div>
    );
};

export default CategoryFilter;
