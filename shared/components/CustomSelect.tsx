import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    isDisabled: boolean;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export const CustomSelect = ({ isDisabled, options, value, onChange, placeholder = "Selecciona una opción", label, }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Obtener la etiqueta de la opción seleccionada actualmente
    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full" ref={containerRef}>
            {label && <label className="font-medium text-neutral-600 dark:text-slate-400">{label}</label>}

            <div className="relative">
                <button
                    disabled={isDisabled}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full p-3 rounded-lg border flex items-center justify-between text-left outline-none transition-all duration-200
                        ${
                            isDisabled
                                ? "bg-neutral-50 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed opacity-80"
                                : "bg-white dark:bg-slate-900 cursor-pointer"
                        }
                        ${
                        isOpen
                            ? "border-cyan-500 ring-4 ring-cyan-500/5 dark:border-cyan-400 dark:ring-cyan-400/20"
                            : "border-neutral-200 hover:border-neutral-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                >
                    <span
                        className={
                            selectedOption ? "text-neutral-800 dark:text-slate-50 font-medium" : "text-neutral-400 dark:text-slate-400"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`size-4 text-neutral-400 dark:text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 ease-in-out">
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    disabled={isDisabled}
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 flex items-center justify-between text-sm transition-colors cursor-pointer ${
                                        isSelected
                                            ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400 font-semibold"
                                            : "text-neutral-700 hover:bg-neutral-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <Check className="size-4 text-cyan-600 dark:text-cyan-400" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};