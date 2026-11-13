import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductSearchProps {
    value?: string;
    onChange?: (value: string) => void;
}

const ProductSearch = ({ value, onChange } : ProductSearchProps) => {
    const t = useTranslations("ProductSearch");

    return (
        <div className="flex min-w-0 items-center">
            <div className="relative w-full max-w-sm min-w-0">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400"
                />

                <input
                    type="search"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={t("placeholder")}
                    aria-label={t("ariaLabel")}
                    className="w-full bg-white dark:bg-slate-900 rounded-full py-2.5 pl-11 pr-4 text-sm text-neutral-800 dark:text-slate-50 shadow-sm placeholder:text-neutral-400 dark:placeholder:text-slate-400 focus:outline-none"
                />
            </div>
        </div>
    );
};

export default ProductSearch;