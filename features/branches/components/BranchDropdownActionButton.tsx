"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Edit, Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteBranchModal } from "@/features/branch-details/components/DeleteBranchModal";
import { Branch } from "../types/branch";

interface BranchDropdownActionButtonProps {
  branch: Branch | null | undefined;
}

const BranchDropdownActionButton = ({
  branch,
}: BranchDropdownActionButtonProps) => {
  const t = useTranslations("BranchDetails.dropdownActions");
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hoverAnimation = { scaleX: 1.1, scaleY: 1.1, borderRadius: "35%" };
  const tapAnimation = { scaleX: 0.9, scaleY: 1.1, borderRadius: "50%" };

  const handleOpenDeleteModal = () => {
    setOpen(false);
    setShowDeleteModal(true);
  };

  return (
    <div
      className="relative flex shrink-0 items-center justify-center gap-2"
      ref={containerRef}
    >
      <motion.button
        aria-haspopup="true"
        aria-expanded={open}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className="cursor-pointer rounded-lg bg-linear-to-b from-brand-50 to-brand-100 p-2 text-brand-700"
        onClick={() => setOpen(!open)}
      >
        <Ellipsis size={20} />
      </motion.button>

      {open && (
        <div className="absolute -top-12 right-2 z-10 flex w-48 -translate-x-1/5 origin-top-right flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
          <button
            onClick={() => setOpen(false)}
            className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-neutral-800 transition-colors duration-200 ease-in-out hover:bg-neutral-100"
          >
            <Edit size={18} />
            <span>{t("edit")}</span>
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-red-600 transition-colors duration-200 ease-in-out hover:bg-red-50"
          >
            <Trash size={18} />
            <span>{t("delete")}</span>
          </button>
        </div>
      )}

      {showDeleteModal && (
        <DeleteBranchModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          branchName={branch?.name}
          branchId={branch?.id}
        />
      )}
    </div>
  );
};

export default BranchDropdownActionButton;