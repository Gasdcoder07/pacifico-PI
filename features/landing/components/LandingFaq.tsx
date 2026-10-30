import { LandingQuotes } from "./CarrouselQuotes";
import { LandingCarrousel } from "./LandingCarrousel";

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
        <h1 className="text-5xl font-bold">Loved by the <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">community</span></h1>
        <p>See what people are saying about PACIFICO</p>
        <div className="w-full gap-8">
          <LandingQuotes />
        </div>
      </div>
    </section>
  );
};

export default LandingFaq;
