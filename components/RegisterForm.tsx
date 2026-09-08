"use client"

import Link from "next/link";
import { useState } from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/services/auth.service";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
       nombre: "",
       apellido: "",
       email: "",
       password: "",
       confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: any) => {
            setErrorMessage(error?.message || "Ocurrió un error durante el registro.");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.");
        return;
    }

    const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.email,      // renombrado aquí
        password: formData.password,
        rol_id: 3,                    // ver nota abajo
        branch_id: null,              // ver nota abajo
    };

    registerMutation.mutate(dataToSend);
};

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {errorMessage && (
                <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
                    {errorMessage}
                </div>
            )}

            <section className="flex flex-col gap-4">
                <div className="flex flex-row gap-5">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="nombre" className="text-xs text-neutral-600">Nombre</label>
                        <input
                            onChange={handleChange}
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            required
                            suppressHydrationWarning
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-cyan-600"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="apellido" className="text-xs text-neutral-600">Apellido</label>
                        <input
                            onChange={handleChange}
                            id="apellido"
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            required
                            suppressHydrationWarning
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-cyan-600"
                        />
                    </div>
                </div>

            
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs text-neutral-600">Email</label>
                    <input
                        onChange={handleChange}
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        required
                        suppressHydrationWarning
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-cyan-600"
                    />
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-xs text-neutral-600">Contraseña</label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                required
                                suppressHydrationWarning
                                className="w-full px-3 py-2 pr-12 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-cyan-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                suppressHydrationWarning
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-xs text-neutral-600">Confirmar contraseña</label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                required
                                suppressHydrationWarning
                                className="w-full px-3 py-2 pr-12 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-cyan-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                suppressHydrationWarning
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mt-4 flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        suppressHydrationWarning
                        className="font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-400 w-full py-2.5 rounded-xl transition-colors ease-in-out duration-200 cursor-pointer flex items-center justify-center"
                    >
                        {registerMutation.isPending ? (
                            <LoadingIndicator />
                        ) : (
                            <p>Crear cuenta</p>
                        )}
                    </button>

                    <span className="text-neutral-600 text-center text-sm">
                        ¿Ya tienes una cuenta? <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-500 ease-in-out duration-200 transition-colors">Inicia sesión</Link>
                    </span>
                </div>
            </section>
        </form>
    );
};

export default RegisterForm;