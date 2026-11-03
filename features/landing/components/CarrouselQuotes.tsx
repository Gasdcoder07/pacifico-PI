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
    author: "Elon Musk",
    quote: "SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX SpaceX ",
    position: "CEO of SpaceX"
  }, {
    author: "Cristiano Ronaldo",
    quote: "Incredible.The best POS in the history. SIUUUUU ",
    position: "Football Player"
  }, {
    author: "V. Vaca",
    quote: "Amazing. Papeleria Lily will grow up a lot with this new POS.",
    position: "Software Engineer"
  }, {
    author: "N. Frías",
    quote: "I love this POS. It is the best POS I have ever used.",
    position: "DB manager."
  },{
    author: "Kanye West",
    quote: "This POS is the best POS I have ever used. It is amazing. I love it.",
    position: "Singer"
  }, {
    author: "Greco Serna",
    quote: "Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex Ciber aeromex ",
    position: "Singer"
  }, {
    author: "V. Vaca",
    quote: "PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY PAPELERIA LILY ",
    position: "Software Engineer"
  }, {
    author: "N. Frías",
    quote: "VALORANT ",
    position: "DB manager."
  },
];

const QuoteRow = ({ items, reverse = false, duration = 40 }: QuoteRowProps) => {
  const track = (hidden: boolean) =>
    items.map((item, index) => (
      <li
        key={`${hidden ? "b" : "a"}-${index}-${item.author}`}
        aria-hidden={hidden}
        className="w-80 shrink-0"
      >
        <figure className="flex h-full min-h-64 flex-col justify-between gap-2 rounded-2xl bg-linear-to-b from-neutral-100 to-neutral-50 p-6 shadow-sm transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
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
        className={`flex w-max gap-4 pr-4 motion-reduce:animate-none ${
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
    <div className="py-12 lg:py-16">
      <div className="flex flex-col gap-4">
        <QuoteRow items={QUOTES} duration={40} />
        <QuoteRow items={[...QUOTES].reverse()} duration={46} reverse />
      </div>
    </div>
  );
};