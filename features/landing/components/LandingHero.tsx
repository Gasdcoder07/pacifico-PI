import Image from "next/image";
import CursorFollower from "./CursorFollower";

export default function LandingHero() {
  return (
    <section
      aria-labelledby="landing-hero-title"
      data-reveal
      className="relative scroll-mt-28 px-6 py-16 md:px-12 md:py-24"
    >
      <CursorFollower />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <span
          data-reveal-item
          className="w-fit rounded-full bg-neutral-100 px-4 py-1 text-sm text-primary/70"
        >
          What do we solve?
        </span>

        <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div
            data-reveal-item
            className="relative aspect-4/3 w-full overflow-hidden rounded-2xl md:aspect-auto md:h-full md:min-h-96"
          >
            <Image
              src="/3.jpg"
              alt="Team working with disconnected business data"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            data-reveal-item
            className="flex flex-col items-center gap-4 md:items-start md:text-left"
          >
            <h2
              id="landing-hero-title"
              className="text-balance text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl"
            >
              Human error, synchronization errors, decentralized data
            </h2>
            <p className="max-w-md text-base text-neutral-600 md:text-lg">
              These are among the biggest day-to-day operational challenges
              faced by small and medium sized enterprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
