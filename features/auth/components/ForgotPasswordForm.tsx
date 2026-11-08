"use client";

import CursorFollower from "@/features/landing/components/CursorFollower";
import Link from "next/link";

export const ForgotPasswordForm = () => {
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

            <form className="flex flex-col items-center gap-4 w-full">
            <div className="text-center flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                Reset your password
                </h1>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                Enter your email, and we'll send you a secure link to reset your password.
                </p>
            </div>

            <div className="w-full flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Email*
                </label>
                <input 
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="p-3 bg-white border border-gray-300 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                placeholder="email@example.com"
                />
            </div>

            <button 
                type="submit" 
                className="py-3 mt-2 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium rounded-2xl px-4 w-full transition-colors"
            >
                Enviar
            </button>

            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                Remember Password?{' '}
                <Link href="/login" className="text-cyan-700 dark:text-cyan-400 font-semibold hover:underline">
                Sign in
                </Link>
            </p>
            </form>
        </section>
    )
}