const reviews = [
  {
    name: "Mariana Ruiz",
    role: "Owner, Café Nube",
    quote:
      "We used to close the day with three different spreadsheets. Now every branch reports to the same place and the numbers finally match.",
  },
  {
    name: "Diego Salas",
    role: "Operations lead, Ferretería Sur",
    quote:
      "Setting up our branches and employees took one afternoon. The team was selling through the system the next morning.",
  },
  {
    name: "Ana Villalobos",
    role: "Manager, Distribuidora Mar",
    quote:
      "Having inventory and sales synchronized removed most of the manual errors we were fixing every single week.",
  },
];

const LandingReviews = () => {
  return (
    <section
      id="reviews"
      data-reveal
      className="flex scroll-mt-28 flex-col items-center gap-8 py-10"
    >
      <div
        data-reveal-item
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="rounded-2xl bg-neutral-100 px-4 py-1 text-sm text-primary/70">
          Who we are?
        </span>
        <h2 className="text-3xl font-medium">
          What our <span className="text-[#3F73DC]">customers feel</span>
          <br />
          about us
        </h2>
        <p className="max-w-md text-xs text-neutral-600">
          We love hearing from the people who joined us. Their experiences
          show the quality and impact of what we do.
        </p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-3">
        {reviews.map(({ name, role, quote }) => (
          <figure
            key={name}
            data-reveal-item
            className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-100"
          >
            <blockquote className="text-sm leading-relaxed text-neutral-700">
              &ldquo;{quote}&rdquo;
            </blockquote>

            <figcaption className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600"
              >
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-900">
                  {name}
                </span>
                <span className="text-xs text-neutral-500">{role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default LandingReviews;
