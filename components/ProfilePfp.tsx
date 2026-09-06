"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProfilePfpProps {
  name: string;
  role: string;
  avatarUrl: string;
}

const ProfilePfp = ({ name, role, avatarUrl }: ProfilePfpProps) => {
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
        <Image
          src={avatarUrl}
          alt={`Foto de perfil de ${name}`}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-12 flex items-center gap-3 rounded-lg border border-gray-200 bg-white shadow-lg p-3 z-50 w-56 whitespace-nowrap">
          <Image
            src={avatarUrl}
            alt=""
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePfp;