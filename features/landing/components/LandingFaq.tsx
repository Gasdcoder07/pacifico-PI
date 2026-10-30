const temp = [1, 2, 3, 4];

const LandingFaq = () => {
  return (
    <section
      id="reviews"
      data-reveal
      aria-labelledby="reviews-heading"
      className="scroll-mt-28 px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        <span
          data-reveal-item
          className="w-fit rounded-full bg-neutral-100 px-4 py-1 text-sm text-primary/70"
        >
          People say about us...
        </span>

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {temp.map((item) => (
            <div
              key={item}
              data-reveal-item
              className="flex min-h-64 flex-col gap-2 rounded-2xl bg-linear-to-b from-neutral-100 to-neutral-50 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900">Elon Musk</h3>
              <p className="italic">{'"Cada vez que pienso me doy cuenta donde estoy y en que momento nunca supe bien por que ni en que momento me empezo a ganar a mi este sentimiento."'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFaq;
