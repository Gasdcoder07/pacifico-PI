import type { CSSProperties } from "react";

interface QuoteItem {
  author: string;
  quote: string;
  position: string;
}

interface QuoteRowProps {
  items: QuoteItem[];
  reverse?: boolean;
  duration?: number;
}

const QUOTES: QuoteItem[] = [
  {
    author: "J. Epstein",
    quote: "KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS",
    position: "Teacher"
  }, {
    author: "P. Diddy",
    quote: "BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL ",
    position: "Singer"
  }, {
    author: "V. Vaca",
    quote: "ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ",
    position: "Software Engineer"
  }, {
    author: "N. Frías",
    quote: "Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina ",
    position: "DB manager."
  },{
    author: "J. Epstein",
    quote: "KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS KIDS",
    position: "Teacher"
  }, {
    author: "P. Diddy",
    quote: "BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL BBY OIL ",
    position: "Singer"
  }, {
    author: "V. Vaca",
    quote: "ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ILSE ",
    position: "Software Engineer"
  }, {
    author: "N. Frías",
    quote: "Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina Llave Latina ",
    position: "DB manager."
  },
];

const QuoteRow = ({ items, reverse = false, duration = 40 }: QuoteRowProps) => {
  const track = (hidden: boolean) =>
    items.map((item) => (
      <li
        key={`${item.author}-${hidden ? "b" : "a"}`}
        aria-hidden={hidden}
        className="w-80 shrink-0"
      >
        <figure className="flex h-full min-h-64 flex-col justify-between gap-2 rounded-2xl bg-linear-to-b from-neutral-100 to-neutral-50 p-6 shadow-sm transition-transform hover:scale-105">
          <span aria-hidden="true" className="text-6xl font-extrabold leading-none text-neutral-400">
            &ldquo;
          </span>
          <blockquote className="italic text-neutral-600">{item.quote}</blockquote>
          <figcaption className="flex flex-col">
            <span className="text-lg font-semibold text-neutral-700">{item.author}</span>
            <span className="text-xs text-neutral-500">{item.position}</span>
          </figcaption>
        </figure>
      </li>
    ));

  return (
    <div
      className="marquee w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <ul
        className={`flex w-max gap-4 pr-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {track(false)}
        {track(true)}
      </ul>
    </div>
  );
};

export const LandingQuotes = () => {
  return (
    <section
      id="reviews"
      data-reveal
      aria-labelledby="reviews-heading"
      className="scroll-mt-8 py-12 lg:py-16"
    >
      <div data-reveal-item className="flex flex-col gap-4">
        <QuoteRow items={QUOTES} duration={40} />
        <QuoteRow items={[...QUOTES].reverse()} duration={46} reverse />
      </div>
    </section>
  );
};