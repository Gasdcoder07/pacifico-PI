"use client";

import CursorFollower from "@/features/landing/components/CursorFollower";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const router = useRouter();

    const resetPasswordMutation = useMutation({
        mutationFn: async (password: string) => {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: password })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('El enlace de recuperación expiró o es inválido. Solicita uno nuevo.');
                }
                throw new Error(data.error || 'Error al actualizar la contraseña');
            }
            return data;
        },
        onSuccess: () => {
            toast.success("Contraseña actualizada con éxito");
            router.push('/login');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Error al actualizar la contraseña';
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error("Debe tener al menos 6 caracteres, una mayúscula y un símbolo");
            return;
        }

        resetPasswordMutation.mutate(newPassword);
    };

    return (
        <section className="py-12 px-8 rounded-4xl border-2 shadow-md border-neutral-200 bg-neutral-50 dark:border-slate-800 dark:bg-slate-950/30 dark:shadow-none flex flex-col gap-6 w-full max-w-lg">
            <CursorFollower />
            <header className="w-full flex justify-center">
                <img 
                    src="/pacifico-logo-horizontal.svg" 
                    alt="Logotipo de Pacifico" 
                    className="w-1/2" 
                />
            </header>

            <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
                <div className="text-center flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                        Set a new Password
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                        Create a strong password to secure your PACIFICO account
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {/* Campo Nueva Contraseña */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            New Password*
                        </label>
                        <div className="relative w-full">
                            <input 
                                id="newPassword"
                                type={showPassword ? "text" : "password"} 
                                required
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-3 pr-12 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                                placeholder="*****"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Campo Confirmar Contraseña */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Confirm Password*
                        </label>
                        <div className="relative w-full">
                            <input 
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="p-3 pr-12 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                                placeholder="*****"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={resetPasswordMutation.isPending}
                    className="py-3 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium rounded-2xl px-4 w-full transition-colors"
                >
                    {resetPasswordMutation.isPending ? 'Actualizando...' : 'Enviar'}
                </button>

                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    Remember Password?{' '}
                    <Link href="/login" className="text-cyan-700 dark:text-cyan-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </section>
    );
};