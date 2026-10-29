"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreateProductModal } from "./AddProductModal";

const AddProductButton = () => {
  const t = useTranslations("InventoryPage.addProductButton");
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="flex cursor-pointer items-center gap-1 rounded-lg bg-cyan-400 p-4 py-2 text-sm font-medium text-white shadow-sm"
      >
        <Plus size={20} className="shrink-0" />
        <span>{t("label")}</span>
      </motion.button>

      {showModal && (
        <CreateProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default AddProductButton;