import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contacts" },
];

const LandingNavbar = () => {
  return (
    <header className="flex min-h-16 items-center justify-between rounded-2xl px-4 py-2">
      <Image
        quality={80}
        priority
        width={1000}
        height={1000}
        src="/pacifico-logo-email.png"
        alt="Logo de Pacífico"
        className="flex h-16 w-auto self-start object-contain -translate-x-1.5"
      />
      <nav className="hidden gap-12 text-xs text-neutral-600 md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="text-center text-sm font-medium text-neutral-50 transition-transform duration-200 hover:-translate-y-0.5 hover:text-white">
            {link.label}
          </a>
        ))}
      </nav>

      <Link
        href="/login"
        className="rounded-full bg-white px-4 py-1.5 font-medium transition-transform duration-200 hover:scale-105"
      >
        <span className="text-sm">Join us!</span>
      </Link>
    </header>
  );
};

export default LandingNavbar;