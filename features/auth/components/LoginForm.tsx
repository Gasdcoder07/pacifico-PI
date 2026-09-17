"use client"

import Link from "next/link";
import { useState } from "react";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import toast from "react-hot-toast";

const LoginForm = () => {
    const { login, isLoggingIn } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await login(formData);

            console.log(response);

            toast.success("Inicio de sesión exitoso");
        } catch (error) {   
            toast.error("Correo o contraseña incorrectos");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
        >
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="email"
                    className="text-neutral-600 text-xs"
                >
                    Email
                </label>

                <input
                    onChange={handleChange}
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-neutral-400"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="password"
                    className="text-neutral-600 text-xs"
                >
                    Contraseña
                </label>

                <div className="relative">
                    <input
                        onChange={handleChange}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        className="w-full p-3 pr-12 text-sm border border-neutral-300 rounded-xl outline-none transition-all duration-200 ease-in-out hover:border-neutral-400 focus:border-neutral-400"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400"
                        aria-label={
                            showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>

                <div className="mt-2 flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="font-semibold text-sm text-cyan-600 hover:text-cyan-500 transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 w-full py-3 rounded-xl transition-colors ease-in-out duration-200 cursor-pointer flex items-center justify-center"
                >
                    {isLoggingIn ? (
                        <LoadingIndicator />
                    ) : (
                        <p>Iniciar sesión</p>
                    )}
                </button>

                <span className="text-neutral-600 text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-cyan-600 hover:text-cyan-500 transition-colors"
                    >
                        Regístrate ahora.
                    </Link>
                </span>
            </div>
        </form>
    );
};

export default LoginForm;