import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contacts", href: "#contacts" },
];

const LandingNavbar = () => {
  return (
    <header className="flex min-h-16 items-center justify-between gap-8">
      <Image
        data-anim="nav-item"
        quality={80}
        priority
        width={1000}
        height={1000}
        src="/pacifico-logo-email.png"
        alt="Logo de Pacífico"
        className="h-16 w-auto -translate-x-1.5 object-contain"
      />

      <nav aria-label="Navegación principal" className="hidden gap-8 md:flex">
        {links.map((link) => (
          <a
            key={link.href}
            data-anim="nav-item"
            href={link.href}
            className="rounded-full text-sm font-medium text-neutral-50 transition-all duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <Link
        data-anim="nav-item"
        href="/login"
        className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        Join us!
      </Link>
    </header>
  );
};

export default LandingNavbar;
