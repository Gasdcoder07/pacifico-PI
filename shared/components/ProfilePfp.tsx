"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProfilePfpProps {
  name: string;
  role: string;
}

const menuVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    y: -10,
    x: 10,
    transition: { type: "spring", bounce: 0, duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    x: 0,
    transition: { 
      type: "spring", 
      bounce: 0.6, 
      duration: 0.6,
      delayChildren: 0.1, 
      staggerChildren: 0.05 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    transition: { duration: 0.15, ease: "easeOut" } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", bounce: 0.5 }
  }
};

const ProfilePfp = ({ name, role }: ProfilePfpProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div ref={containerRef} className="relative z-50">
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full cursor-pointer focus:outline-none origin-center"
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
          duration: 0.8
        }}
      >
        <div 
          style={{ width: 50, height: 50 }}
          className="rounded-full object-cover bg-cyan-400"
        />
      </motion.button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-14 flex flex-col items-stretch gap-1 rounded-2xl border border-gray-100 bg-white shadow-xl p-2 w-64 origin-top-right"
          >
            <motion.div variants={itemVariants}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.5 }}
                onClick={() => {}} 
                className="w-full text-neutral-900 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-100"
              >
                <div
                  style={{ width: 40, height: 40 }}
                  className="rounded-full object-cover bg-cyan-400 shrink-0"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                </div>
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="px-3 py-1">
              <div className="w-full border-t border-gray-100" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.5 }}
                onClick={logout}
                className="w-full text-neutral-500 flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="shrink-0 w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePfp;