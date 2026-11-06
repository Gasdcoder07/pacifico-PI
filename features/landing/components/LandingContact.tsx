import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface Author {
  name: string;
  gh: string;
}

const AUTHORS: Author[] = [
  { name: "Greco Serna", gh: "https://github.com/Gasdcoder07" },
  { name: "Valentín Vaca", gh: "https://github.com/valent-x7" },
  { name: "Manuel Martínez", gh: "https://github.com/IsahitMartinez" },
  { name: "Nelvín Frías", gh: "https://github.com/nelvinfrias" },
  { name: "Brian Sebastián", gh: "https://github.com/BSebastian-IS" },
  { name: "Ángel Arres", gh: "https://github.com/4NGEL3MANUEL" },
];

const LandingContact = () => {
  const t = useTranslations("LandingPage.contact");

  return (
    <section
      id="contacts"
      data-reveal
      aria-labelledby="contacts-heading"
      className="scroll-mt-28 rounded-2xl bg-neutral-100 px-6 py-12 md:px-12 lg:px-24 lg:py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-reveal-item className="flex flex-col justify-center gap-4">
          <h2
            id="contacts-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl"
          >
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p className="max-w-md text-base text-neutral-600 md:text-lg">
            {t("description")}
          </p>
        </div>

        <div data-reveal-item className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/pacifico-logo.svg"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <p className="text-2xl font-bold text-neutral-900">PACIFICO</p>
            </div>
            <p className="max-w-md text-sm text-neutral-600 md:text-base">
              {t("companyDescription")}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6">
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              {t("authors")}
            </h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {AUTHORS.map((author) => (
                <li key={author.gh} data-reveal-item>
                  <Link
                    href={author.gh}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${author.name} on GitHub`}
                    className="flex items-center gap-2 rounded-2xl bg-white p-3 text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:text-cyan-700 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <FaGithub aria-hidden="true" className="shrink-0" />
                    <span className="truncate text-xs font-medium">
                      {author.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingContact;