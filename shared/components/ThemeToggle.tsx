"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");

        const isDark =
            saved === "dark" ||
            (!saved &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    }, []);

    function cambiarTema() {
        const nuevoTema = !dark;

        setDark(nuevoTema);
        document.documentElement.classList.toggle("dark", nuevoTema);
        document.documentElement.style.colorScheme = nuevoTema ? "dark" : "light";

        localStorage.setItem("theme", nuevoTema ? "dark" : "light");
    }

    return (
        <button type="button" onClick={cambiarTema} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"} title={dark ? "Activar modo claro" : "Activar modo oscuro"} className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2 transition-colors cursor-pointer">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}