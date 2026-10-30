import Image from "next/image";
import CursorFollower from "./CursorFollower";

export default function LandingHero() {
  return (
    <section
      aria-labelledby="landing-hero-title"
      data-reveal
      className="relative w-full px-4 py-16 md:py-36"
    >
      <CursorFollower />

      <div className="flex w-full flex-col items-center gap-8 text-center">
        <span
          data-reveal-item
          className="rounded-2xl bg-neutral-100 px-4 py-1 text-sm text-primary/70"
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
              className="text-balance text-3xl font-bold leading-tight md:text-5xl"
            >
              Human error, synchronization errors, decentralized data
            </h2>
            <p className="max-w-md text-lg text-neutral-600">
              These are among the biggest day-to-day operational challenges
              faced by small and medium sized enterprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
