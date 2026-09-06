"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePfpProps {
  name: string;
  role: string;
}

const ProfilePfp = ({ name, role }: ProfilePfpProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative">
        <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
        aria-haspopup="true"
        aria-expanded={open}
        >
        <div 
          style={{
            width: 40,
            height: 40
          }}
          className="rounded-full object-cover bg-red-400"
        />
        {/*<Image
          src="@/public/auth_image.webp"
          alt={`Foto de perfil de ${name}`}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />*/}
      </button>
      <AnimatePresence >

        {open && (
          <motion.div 
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            className="absolute right-0 top-12 flex items-center gap-3 rounded-lg border border-gray-200 bg-white shadow-lg p-3 z-50 w-56 whitespace-nowrap"
          >
            <div 
              style={{ width: 40, height: 40 }}
              className="rounded-full object-cover bg-red-400 shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePfp;