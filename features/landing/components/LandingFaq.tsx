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
        <h2
          id="reviews-heading"
          className="text-center text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl"
        >
          People say about us...
        </h2>

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
