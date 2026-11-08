"use client";

import CursorFollower from "@/features/landing/components/CursorFollower";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const ForgotPasswordForm = () => {
    const router = useRouter();
    
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const sendCodeMutation = useMutation({
        mutationFn: async (userEmail: string) => {
            const normalizedEmail = userEmail.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                throw new Error('Ingresa un correo válido');
            }

            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar el código');
            return true;
        },
        onSuccess: () => {
            toast.success("Código enviado a tu correo");
            setStep(2); 
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const verifyAndUpdateMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/auth/verify-recovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    token, 
                    newPassword 
                })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar la contraseña');
            return data;
        },
        onSuccess: () => {
            toast.success("Contraseña actualizada con éxito");
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const handleSendCode = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendCodeMutation.mutate(email);
    };

    const handleVerifyAndUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (token.length !== 8) {
            toast.error("El código debe tener 8 dígitos");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        if (!/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(newPassword)) {
            toast.error("Debe tener al menos 6 caracteres, una mayúscula y un símbolo");
            return;
        }

        verifyAndUpdateMutation.mutate();
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

            {step === 1 ? (
                <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSendCode}>
                    <div className="text-center flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                            Reset your password
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Enter your email, and we will send you a 6-digit code to reset your password.
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Email*
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="p-3 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                            placeholder="email@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sendCodeMutation.isPending}
                        className="py-3 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium rounded-2xl px-4 w-full transition-colors"
                    >
                        {sendCodeMutation.isPending ? 'Enviando...' : 'Enviar Código'}
                    </button>

                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                        Remember Password?{' '}
                        <Link href="/login" className="text-cyan-700 dark:text-cyan-400 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            ) : (
                <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleVerifyAndUpdate}>
                    <div className="text-center flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                            Set a new Password
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Enter the code sent to {email}
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label htmlFor="token" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                6-Digit Code*
                            </label>
                            <input 
                                id="token"
                                type="text"
                                maxLength={8}
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))} 
                                className="p-3 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 text-center tracking-widest text-lg font-semibold rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                                placeholder="000000"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full">
                            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                New Password*
                            </label>
                            <div className="relative w-full">
                                <input 
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="p-3 pr-12 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
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

                        <div className="flex flex-col gap-1.5 w-full">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                Confirm Password*
                            </label>
                            <div className="relative w-full">
                                <input 
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="p-3 pr-12 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
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
                        disabled={verifyAndUpdateMutation.isPending}
                        className="py-3 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium rounded-2xl px-4 w-full transition-colors"
                    >
                        {verifyAndUpdateMutation.isPending ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-cyan-700 dark:text-cyan-400 font-semibold hover:underline mt-2"
                    >
                        Volver a enviar código
                    </button>
                </form>
            )}
        </section>
    );
};