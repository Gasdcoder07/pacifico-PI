"use client";

import { sidebarNavigation } from "@/config/navigation";
import { ChevronsRight, LogOut, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <motion.aside
            initial={false}
            animate={ { width: isOpen ? 256 : 88 } }
            transition={ {
                duration: 0.2,
                ease: "easeInOut"
            } }
            className={`p-4 flex flex-col justify-between gap-4 border-r border-neutral-300`}>
            <div className="flex-1 flex flex-col justify-between">
                <ul
                    className="flex flex-col gap-4">
                    {
                        sidebarNavigation.map((item) => {
                            const isActive = pathname.includes(item.href);

                            return (
                                <SidebarOption
                                    key={item.id}
                                    open={isOpen}
                                    name={item.id}
                                    icon={item.icon}
                                    href={item.href}
                                    isSelected={isActive}/>
                            )
                        })
                    }
                </ul>

                <LogoutButton open={isOpen} onLogout={logout}/>
            </div>
                    
            <ToggleClose open={isOpen} setIsOpen={setIsOpen}/>
        </motion.aside>
    )
};

export default Sidebar;

interface SidebarOptionProps {
    open : boolean;
    name : string;
    href : string;
    icon : LucideIcon;
    isSelected : boolean;
}

const SidebarOption = ({ open, name, href, icon : Icon, isSelected } : SidebarOptionProps) => {
    return (
        <li>
            <Link
                href={href}
                title={!open ? name : undefined}
                className={`${isSelected ? 'bg-linear-to-b from-brand-50 to-brand-100 text-brand-700' : 'text-neutral-500'} flex items-center gap-4 px-4 py-3 rounded-md duration-200 ease-in-out hover:bg-linear-to-b from-brand-50 to-brand-100 hover:text-brand-700 hover:scale-105 transition-all`}>
                <Icon className="shrink-0"/>
                <AnimatePresence initial={false}>
                    {open && (
                            <motion.span 
                                initial={{ opacity: 0, width: 0, x: -50 }}
                                animate={{ opacity: 0.9, width: "auto", x: 0 }}
                                className="text-sm font-medium"
                            >
                                    {name}
                            </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </li>
    )
}

interface ToggleCloseProps {
    open : boolean;
    setIsOpen : Dispatch<SetStateAction<boolean>>
}

const ToggleClose = ({ open, setIsOpen } : ToggleCloseProps) => {
    return (
        <div className="border-t border-neutral-300 pt-4">
            <button
                onClick={() => setIsOpen(!open)}
                className="w-full flex items-center px-4 py-3 gap-4 rounded-md transition-all duration-200 ease-in-out hover:bg-linear-to-b from-brand-50 to-brand-100 hover:text-brand-700 cursor-pointer">
                <ChevronsRight className={`transition-transform ${open && 'rotate-180'} shrink-0`}/>

                {
                    open && (
                        <span className="text-sm font-medium">Hide</span>
                    )
                }
            </button>
        </div>
    )
}

interface LogoutButtonProps {
    open : boolean;
    onLogout : () => void;
}

const LogoutButton = ({ open, onLogout } : LogoutButtonProps) => {
    return (
        <button onClick={onLogout} className="text-neutral-500 flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 ease-in-out hover:bg-linear-to-b from-brand-50 to-brand-100 hover:text-brand-700 hover:scale-105 cursor-pointer">
            <LogOut className="shrink-0"/>

            <AnimatePresence initial={false}>
                {open && (
                        <motion.span 
                            initial={{ opacity: 0, width: 0, x: -50 }}
                            animate={{ opacity: 0.9, width: "auto", x: 0 }}
                            className="text-sm font-medium"
                        >
                                Logout
                        </motion.span>
                )}
            </AnimatePresence>
        </button>
    )
}