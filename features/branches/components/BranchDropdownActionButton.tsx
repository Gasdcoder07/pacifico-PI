"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash, Edit, Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteBranchModal } from "@/features/branch-details/components/DeleteBranchModal";
import { Branch } from "../types/branch";
import EditBranchPanel from "@/features/branch-details/components/EditBranchPanel";
import { useTranslations } from "next-intl";

interface BranchDropdownActionButtonProps {
  branch: Branch | null | undefined;
}

const BranchDropdownActionButton = ({ branch } : BranchDropdownActionButtonProps) => {
    const t = useTranslations("BranchDetails.cardDetails.actions");

    const containerRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

            {
                open && (
                    <div
                        className="absolute right-2 -top-12 -translate-x-1/5 z-10 flex flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white shadow-lg p-2 w-48 origin-top-right">
                        <button
                            onClick={() => setShowEditPanel(true)}
                            className="h-10 w-full text-neutral-800 flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-neutral-100">
                            <Edit size={18}/>
                            <span>{t("edit")}</span>
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="h-10 w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer text-red-600 hover:bg-red-50">
                            <Trash size={18}/>
                            <span>{t("delete")}</span>
                        </button>
                    </div>
                )
            }

            {
                showDeleteModal && (
                    <DeleteBranchModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        branchName={branch?.name}
                        branchId={branch?.id}/>
                )
            }

            {
                showEditPanel && (
                    <EditBranchPanel
                        isOpen={showEditPanel}
                        onClose={() => setShowEditPanel(false)}/>
                )
            }
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