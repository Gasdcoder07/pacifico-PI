"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash, Ellipsis, Building2, BriefcaseBusiness } from "lucide-react";

import Link from "next/link";
import { DeleteUserModal } from "./DeleteUserModal";

import { useTranslations } from "next-intl";
import { User } from "../types/user";
import { BranchId } from "@/features/branches/types/branch";
import { menuVariants, itemVariants } from "@/shared/animations/dropdown.animations";
import { createSlug } from "@/shared/utils/create.slug";
import ChangeRoleModal from "@/features/branch-details/components/ChangeRoleModal";

interface UserDropdownActionButtonProps {
  user: User;
  branchId: BranchId;
  isAdminView: boolean;
  isBranchDetailsView?: boolean;
  haveManager?: boolean;
}

const MotionLink = motion.create(Link);

const UserDropdownActionButton = ({
  user,
  branchId,
  isAdminView,
  isBranchDetailsView = false,
  haveManager,
}: UserDropdownActionButtonProps) => {
  const t = useTranslations("BranchDetails.usersContainer.actions");
  const containerRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);

    const isManager = Number(user.rol_id) === 2;
    const isCashier = Number(user.rol_id) === 3;

    const canPromote = isCashier && haveManager === false;
    const canDemote = isManager;

    const canChangeRole = canPromote || canDemote;

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

  const hoverAnimation = { scaleX: 1.1, scaleY: 1.1 }
  const tapAnimation = { scaleX: 0.9, scaleY: 1.1, borderRadius: "50%" }

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
        className={`rounded-lg bg-linear-to-b from-brand-50 to-brand-100 p-1 text-brand-700 dark:bg-none dark:bg-cyan-500/15 dark:text-cyan-400 cursor-pointer`}
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
            className="absolute right-2 z-10 flex w-max min-w-44 -translate-x-1/5 origin-top-right flex-col items-stretch gap-2 rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-lg">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">

            {
                !isBranchDetailsView && isAdminView && user.branch_name && (
                    <MotionLink
                        href={`/branch/${branchId}/${encodeURIComponent(createSlug(user.branch_name))}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        onClick={() => {
                            setOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 text-neutral-900 dark:text-slate-50 transition-colors duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <Building2 size={18} />
                        <span className="font-medium">{t("viewBranch")}</span>
                    </MotionLink>
                )
            }

            {
                isBranchDetailsView && isAdminView && canChangeRole && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        onClick={() => {
                            setShowChangeRoleModal(true);
                            setOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 transition-colors duration-200 ease-in-out text-neutral-900 dark:text-slate-50 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <BriefcaseBusiness size={18} />
                        <span className="font-medium">
                            {isManager ? t("changeToCashier") : t("promoteToManager")}
                        </span>
                    </motion.button>
                )
            }
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.5 }}
                onClick={() => {
                setShowDeleteModal(true);
                setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2 transition-colors duration-200 ease-in-out text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
                <Trash size={18} />
                <span className="font-medium">{t("delete")}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

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

      {
        showChangeRoleModal && haveManager !== undefined && branchId !== undefined && (
            <ChangeRoleModal
                isOpen={showChangeRoleModal}
                onClose={() => setShowChangeRoleModal(false)}
                user={user}
                branchId={branchId}
                haveManager={haveManager}/>
        )
      }
    </div>
  );
};

export default UserDropdownActionButton;