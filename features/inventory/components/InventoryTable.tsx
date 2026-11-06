"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Ellipsis, Trash } from "lucide-react";

import { menuVariants, itemVariants } from "@/shared/animations/dropdown.animations";
import { Product } from "@/features/sell/types/product";
import { useFormatter, useTranslations } from "next-intl";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";

import EmptyState from "./EmptyState";

interface InventoryTableProps {
    isLoading: boolean;
    products: Product[];
    isAdmin: boolean;
}

const InventoryTable = ({ isLoading, products, isAdmin } : InventoryTableProps) => {
  const t = useTranslations("InventoryPage.table");
  const scrollbarStyles = "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-600";

  if (isLoading) return <InventoryTableSkeleton />;

  if (products.length === 0) return <EmptyState/>

  return (
    <div className="flex max-h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
      <div
        className={`flex-1 overflow-x-hidden overflow-y-auto ${scrollbarStyles}`}
      >
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left text-xs uppercase tracking-wider text-neutral-600 dark:text-slate-400 whitespace-nowrap">
            <tr>
              <th className="w-14 px-4 py-3">{t("headers.id")}</th>
              <th className="w-[clamp(160px,28vw,320px)] px-4 py-3">{t("headers.product")}</th>
              {
                isAdmin && (
                    <th className="w-30 px-4 py-3">{t("headers.branch")}</th>
                )
              }
              <th className="w-20 px-4 py-3">{t("headers.stock")}</th>
              <th className="hidden w-30 px-4 py-3 xl:table-cell">{t("headers.status")}</th>
              <th className="w-28 px-4 py-3 text-right">{t("headers.price")}</th>
              <th className="w-18 px-4 py-3 text-center">{t("headers.action")}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-slate-800">
            {products.map((product: Product) => (
              <InventoryTableRow
                key={product?.inventario_id}
                isAdmin={isAdmin}
                product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;

interface InventoryTableRowProps {
  product: Product;
  isAdmin: boolean;
}

export const InventoryTableRow = ({ product, isAdmin }: InventoryTableRowProps) => {
  const format = useFormatter();

  return (
    <tr className="bg-white text-neutral-900 dark:bg-slate-900 dark:text-slate-50">
      <td className="px-4 py-3 text-xs text-neutral-600 dark:text-slate-400 whitespace-nowrap overflow-auto scroll-auto">
        #{product.inventario_id}
      </td>
      <td title={product.name} className="px-4 py-3">
        <div className="flex items-center justify-start gap-4">
          <div className="shrink-0 relative h-16 w-20 overflow-hidden rounded-lg border border-neutral-200 shadow-sm dark:border-slate-800">
            <img
              src={product.foto_url}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate font-semibold whitespace-nowrap text-sm text-neutral-900 dark:text-slate-50">
                {product.name}
            </p>
            <p className="text-xs text-neutral-600 dark:text-slate-400">{product.category_name}</p>
          </div>
        </div>
      </td>
      {
        isAdmin && (
        <td className="px-4 py-3 text-xs text-neutral-600 dark:text-slate-400">
            <div className="flex flex-col gap-1">
            <p className="truncate font-medium whitespace-nowrap">{product.branch_name}</p>
            </div>
        </td>
        )
      }
      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-slate-400">{product.quantity}</td>
      <td className="hidden px-4 py-3 text-sm text-neutral-600 dark:text-slate-400 xl:table-cell">
        <StockBadge quantity={product.quantity} />
      </td>
      <td className="px-4 py-3 text-right text-sm font-semibold text-neutral-900 dark:text-white">
        {format.number(product.price, {
          style: "currency",
          currency: "USD",
          currencyDisplay: "narrowSymbol",
        })}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <DropdownActionButton
            product={product}/>
        </div>
      </td>
    </tr>
  );
};

interface StockBadgeProps {
  quantity: number;
}

export const StockBadge = ({ quantity }: StockBadgeProps) => {
  const t = useTranslations("InventoryPage.table.stockStatus");
  let badgeStyles = "";
  let dotStyles = "";
  let label = "";

  if (quantity === 0) {
    badgeStyles = "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30";
    dotStyles = "bg-red-500";
    label = t("outOfStock");
  } else if (quantity > 0 && quantity <= 8) {
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30";
    dotStyles = "bg-amber-500";
    label = t("lowStock");
  } else {
    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30";
    dotStyles = "bg-emerald-500";
    label = t("inStock");
  }

  return (
    <span className={`flex shrink-0 items-center justify-center gap-2 rounded-full border px-1.5 py-1 whitespace-nowrap ${badgeStyles}`}>
      <div className={`size-1.5 rounded-full ${dotStyles}`} />
      {label}
    </span>
  );
};

interface DropdownActionButtonProps {
    product: Product
}

export const DropdownActionButton = ({ product } : DropdownActionButtonProps ) => {
  const t = useTranslations("InventoryPage.table.actions");
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    });

    const handleToggleMenu = () => {
    if (open) {
        setOpen(false);
        return;
    }

    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const menuWidth = 176;
    const menuHeight = 112;
    const gap = 8;

    setMenuPosition({
        top: Math.max(
        8,
        Math.min(
            rect.top + rect.height / 2 - menuHeight / 2,
            window.innerHeight - menuHeight - 8
        )
        ),

        left:
        rect.left >= menuWidth + gap
            ? rect.left - menuWidth - gap
            : rect.right + gap,
    });

    setOpen(true);
    };

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;

        if (
        !containerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
        ) {
        setOpen(false);
        }
    }

    function handleScrollOrResize() {
        setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);

    if (open) {
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
    };
    }, [open]);

  return (
    <div className="relative flex shrink-0 items-center justify-center gap-2" ref={containerRef}>
      <motion.button
        aria-haspopup="true"
        aria-expanded={open}
        whileHover={{
          scaleX: 1.1,
          scaleY: 1.1,
          borderRadius: "35%",
        }}
        whileTap={{
          scaleX: 0.9,
          scaleY: 1.1,
          borderRadius: "50%",
        }}
        transition={{
          type: "spring",
          bounce: 0.6,
          duration: 0.8,
        }}
        className="cursor-pointer rounded-lg bg-linear-to-b from-brand-50 to-brand-100 p-1 text-brand-700 dark:bg-none dark:bg-cyan-500/15 dark:text-cyan-400"
        onClick={handleToggleMenu}
      >
        <Ellipsis size={20} />
      </motion.button>

        {typeof document !== "undefined" &&
        createPortal(
            <AnimatePresence>
            {open && (
                <motion.div
                ref={menuRef}
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                    position: "fixed",
                    top: menuPosition.top,
                    left: menuPosition.left,
                }}
                className="z-50 flex w-44 origin-center flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-2"
                >
                    <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    onClick={() => {
                        setShowEditModal(true);
                        setOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 text-neutral-900 transition-colors duration-200 hover:bg-gray-100 dark:text-slate-50 dark:hover:bg-slate-700"
                    >
                    <Edit size={18} />
                    <span>{t("edit")}</span>
                    </motion.button>

                    <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    onClick={() => {
                        setShowDeleteModal(true);
                        setOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                    <Trash size={18} />
                    <span>{t("delete")}</span>
                    </motion.button>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>,
            document.body
        )}

        {
            showDeleteModal && (
                <DeleteProductModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    productName={product.name}
                    productId={String(product.product_id)}
                    branchName={product.branch_name}
                    branchId={product.branch_id}
                    />
            )
        }

        {
            showEditModal && (
                <EditProductModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    product={product}/>
            )
        }
    </div>
  );
};

export const InventoryTableSkeleton = () => {
  return (
    <div className="h-full min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-neutral-200 shadow-sm w-full dark:bg-slate-800" />
  );
};