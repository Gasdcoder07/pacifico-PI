import { LanguageSwitcher } from  "@/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/shared/components/ThemeToggle";

export default function AuthLayout({ children } : { children : React.ReactNode; }) {
    return (
        <main className="relative h-screen font-Inter antialiased p-4 dark:bg-slate-900">
            <div className="absolute top-8 right-8 z-10 flex gap-4 items-center">
                <ThemeToggle/>
                <LanguageSwitcher />
            </div>

            {children}
        </main>
    );
}