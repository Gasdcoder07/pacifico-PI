import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "Program", href: "#program" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contacts" },
];

const LandingNavbar = () => {
  return (
    <header className="flex items-center justify-between rounded-2xl bg-white px-4 py-2 shadow-sm">
      <span className="text-sm font-semibold">Nourish</span>

      <nav className="hidden gap-6 text-xs text-neutral-600 md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-neutral-900">
            {link.label}
          </a>
        ))}
      </nav>

      <Link
        href="/login"
        className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium hover:bg-neutral-50"
      >
        Go on a trip!
      </Link>
    </header>
  );
};

export default LandingNavbar;