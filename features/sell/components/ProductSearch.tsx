import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

const ProductSearch = () => {
    const t = useTranslations("ProductSearch");

    return (
        <div className="flex w-full items-center gap-3">
            <div className="relative w-full sm:w-2/5">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                    type="search"
                    placeholder={t("placeholder")}
                    aria-label={t("ariaLabel")}
                    className="w-full bg-white rounded-full py-2.5 pl-11 pr-4 text-sm text-neutral-800 shadow-sm placeholder:text-neutral-400 focus:outline-none"
                />
            </div>
        </div>
    );
};

export default ProductSearch;