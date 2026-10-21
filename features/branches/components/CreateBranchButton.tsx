"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { CreateBranchModal } from "./CreateBranchModal";

const CreateBranchButton = () => {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations("Branches.createButton");

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
        className="flex cursor-pointer items-center gap-2 self-end rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm"
      >
        <Plus size={20} className="shrink-0" />
        <span>{t("label")}</span>
      </motion.button>

      {showModal && (
        <CreateBranchModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CreateBranchButton;