"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProfilePfpProps {
  name: string;
  role: string;
}

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
    <motion.div 
      ref={containerRef}
      className="relative"
    >
        <motion.button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full cursor-pointer focus:outline-none origin-center"
          aria-haspopup="true"
          aria-expanded={open}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            borderRadius: "35%" 
          }}
          whileTap={{ 
            scale: 1.05, 
            rotate: -5,
            borderRadius: "50%"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 12 
          }}
        >
        <div 
          style={{
            width: 50,
            height: 50
          }}
          className="rounded-full object-cover bg-cyan-400"
        />
        {/*<Image
          src="@/public/auth_image.webp"
          alt={`Foto de perfil de ${name}`}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />*/}
      </motion.button>
      <AnimatePresence >

        {open && (
          <motion.div 
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            className="absolute right-0 top-12 flex flex-col items-stretch gap-3 rounded-lg border border-gray-200 bg-white shadow-lg p-3 z-50 w-64"
          >
          <button onClick={() => {}} className="w-full text-neutral-900 flex items-center gap-4 py-3 pr-4 pl-1.5 rounded-md transition-all duration-200 ease-in-out hover:bg-linear-to-b hover:from-brand-50 hover:to-brand-100 hover:text-brand-700 cursor-pointer">
            <div
              style={{ width: 50, height: 50 }}
              className="rounded-full object-cover bg-cyan-400 shrink-0"
            />

            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              {/* <p className="text-xs text-gray-500">{role}</p> */}
            </div>
          </button>

          <div className="w-full border-t border-gray-200 pt-2">
            <button
              onClick={logout}
              className="w-full text-neutral-500 flex items-center gap-4 py-3 pr-4 pl-5 rounded-md transition-all duration-200 ease-in-out hover:bg-linear-to-b hover:from-brand-50 hover:to-brand-100 hover:text-brand-700 cursor-pointer"
            >
              <LogOut className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePfp;