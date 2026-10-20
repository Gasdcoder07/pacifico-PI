import { LanguageSwitcher } from  "@/i18n/components/LanguageSwitcher";

export default function AuthLayout({ children } : { children : React.ReactNode; }) {
    return (
        <main className="relative h-screen font-Inter antialiased p-4">
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>

            {children}
        </main>
    );
}