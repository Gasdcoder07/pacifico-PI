"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
    const t = useTranslations("theme");
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
        <motion.button
            aria-haspopup="true"
            whileHover={{ 
                scaleX: 1.1, 
                scaleY: 1.1,
            }}
            whileTap={{ 
                scaleX: 0.9, 
                scaleY: 1.1,
            }}
            transition={{ 
                type: "spring", 
                bounce: 0.6, 
                duration: 0.8
            }}
            type="button"
            onClick={cambiarTema}
            aria-label={dark ? t("enableLightMode") : t("enableDarkMode") }
            title={dark ? t("enableLightMode") : t("enableDarkMode") }
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-neutral-600 dark:text-slate-200 cursor-pointer shadow-sm">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
    );
}