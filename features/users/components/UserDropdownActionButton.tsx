"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash, Edit, Ellipsis } from "lucide-react";

import { useTranslations } from "next-intl";
import EditUserPanel from "./EditUserPanel";
import { DeleteUserModal } from "./DeleteUserModal";
import { User } from "../types/user";
import { BranchId } from "@/features/branches/types/branch";
import { menuVariants, itemVariants } from "@/shared/animations/dropdown.animations";

interface UserDropdownActionButtonProps {
  user: User;
  isMe: boolean;
  branchId: BranchId;
}

const UserDropdownActionButton = ({
  user,
  isMe,
  branchId,
}: UserDropdownActionButtonProps) => {
  const t = useTranslations("BranchDetails.usersContainer.actions");
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
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

  const hoverAnimation = !isMe ? { scaleX: 1.1, scaleY: 1.1 } : undefined;
  const tapAnimation = !isMe
    ? { scaleX: 0.9, scaleY: 1.1, borderRadius: "50%" }
    : undefined;

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
        transition={
          !isMe ? { type: "spring", bounce: 0.6, duration: 0.8 } : undefined
        }
        disabled={isMe}
        className={`rounded-lg border border-brand-100 bg-linear-to-b from-brand-50 to-brand-100 p-1 text-brand-700 ${
          isMe ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => setOpen(!open)}
      >
        <Ellipsis size={20} />
      </motion.button>

    <AnimatePresence>
      {open && (
        <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-2 -top-12 z-10 flex w-44 -translate-x-1/5 origin-top-right flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.5 }}
                onClick={() => {
                setShowEditPanel(true);
                setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 text-neutral-900 transition-colors duration-200 ease-in-out hover:bg-gray-100"
            >
                <Edit size={18} />
                <span className="font-medium">{t("edit")}</span>
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.5 }}
                onClick={() => {
                setShowDeleteModal(true);
                setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 transition-colors duration-200 ease-in-out text-red-600 hover:bg-red-50"
            >
                <Trash size={18} />
                <span className="font-medium">{t("delete")}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {showEditPanel && (
        <EditUserPanel
          isOpen={showEditPanel}
          onClose={() => setShowEditPanel(false)}
          user={user}
        />
      )}

      {showDeleteModal && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          userName={user.name}
          userLastName={user.last_name}
          userId={user.id}
          branchId={branchId}
        />
      )}
    </div>
  );
};

export default UserDropdownActionButton;