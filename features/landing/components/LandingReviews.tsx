import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { LandingCarrousel } from "./LandingCarrousel";

const LandingReviews = () => {
  return (
    <section
      id="about"
      data-reveal
      aria-labelledby="about-heading"
      className="scroll-mt-28 rounded-2xl bg-neutral-100 px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div data-reveal-item className="flex flex-col gap-4">
          <h2
            id="about-heading"
            className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl"
          >
            Manage your operations and finances in a{" "}
            <span className="text-cyan-600/60">simple way.</span>
          </h2>
          <p className="max-w-md text-base text-neutral-600 md:text-lg">
            Set it up once, use it anywhere.
          </p>
        </div>

        <hr className="border-neutral-200" />

        <div data-reveal-item className="flex flex-col items-start gap-4">
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Built with
          </h3>
          <LandingCarrousel />
        </div>

        <div data-reveal-item>
          <Link
            href="https://github.com/Gasdcoder07/pacifico-PI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            <FaGithub aria-hidden="true" color="black" />
            Support the repository
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingReviews;
