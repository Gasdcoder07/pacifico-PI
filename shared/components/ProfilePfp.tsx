"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import "blobatar/motion.css";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Blobatar } from "@blobatar/react";
import { LogoutModal } from "@/shared/components/LogoutModal";
import { UserProfile } from "@/features/auth/types/authInterfaces";
import EditProfilePanel from "./EditProfilePanel";

interface ProfilePfpProps {
    user?: UserProfile | null;
    isLoading: boolean;
}

const menuVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.5,
        y: -10,
        x: 10,
        transition: { type: "spring", bounce: 0, duration: 0.2 },
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.6,
            delayChildren: 0.05,
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15, ease: "easeOut" },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.5 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", bounce: 0.3 },
    },
};

const ProfilePfp = ({ user, isLoading }: ProfilePfpProps) => {
    const t = useTranslations("ProfilePfp");

    const [open, setOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    
    const { logout } = useAuth();

    const handleLogoutConfirm = () => {
        setLogoutModalOpen(false);
        queryClient.clear();
        logout();
    };

    const fullName = `${user?.name} ${user?.last_name}`;
    const rol = user?.rol_id;

    const roleName =
        rol === 1 ? t("roles.admin")  : rol === 2 ? t("roles.manager") : t("roles.cashier");

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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="relative z-50 flex items-center"
        >
            <motion.button
                disabled={isLoading}
                onClick={() => {
                    if (isLoading) return;
                    setOpen((prev) => !prev)
                }}
                className="flex items-center justify-center rounded-full cursor-pointer focus:outline-none origin-center"
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
            >
                <div className="relative">
                    {
                        isLoading ? (
                            <div className="bg-neutral-200 dark:bg-slate-800 animate-pulse rounded-full size-10 shrink-0 transition-all duration-200 ease-in-out shadow-sm"/>
                        ) : (
                            <>                            
                                <Blobatar
                                    name={fullName}
                                    animate="always"
                                    className="size-10 object-cover rounded-full cursor-pointer border border-neutral-200 dark:border-slate-700 shadow-sm"
                                />
            
                                <div className="absolute bottom-0 translate-x-1/2 size-2 rounded-full bg-green-600 dark:bg-emerald-400 dark:ring-2 dark:ring-slate-900" />
                            </>
                        )
                    }
                </div>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 top-14 flex flex-col items-stretch gap-1 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-2 w-64 origin-top-right"
                    >
                        <motion.div variants={itemVariants}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                onClick={() => {
                                    if (isLoading) return;

                                    setOpen(false);
                                    setShowProfileModal(true)
                                }}
                                className="w-full text-neutral-900 dark:text-slate-50 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                            >
                                <Blobatar
                                    name={fullName}
                                    animate="always"
                                    className="size-10"
                                />

                                <div className="text-left flex flex-col gap-0">
                                    <span className="text-xs text-neutral-600 dark:text-slate-400 font-medium">
                                        {roleName}
                                    </span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-50">
                                        {fullName}
                                    </p>
                                </div>
                            </motion.button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="px-3 py-1"
                        >
                            <div className="w-full border-t border-gray-100 dark:border-slate-700" />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                onClick={() => {
                                    setOpen(false);
                                    setLogoutModalOpen(true);
                                }}
                                className="w-full text-neutral-500 dark:text-slate-400 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                                <LogOut className="shrink-0 w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {t("LogoutModal.title")}
                                </span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <LogoutModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />

            {
                user && showProfileModal && (
                    <EditProfilePanel
                        isOpen={showProfileModal}
                        onClose={() => setShowProfileModal(false)}
                        user={user}/>
                )
            }
        </motion.div>
    );
};

export default ProfilePfp;
