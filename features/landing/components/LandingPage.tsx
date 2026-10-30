"use client";

import Image from "next/image";

import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingReviews from "./LandingReviews";
import LandingFaq from "./LandingFaq";
import LandingContact from "./LandingContact";
import LandingAnimator from "./LandingAnimator";

const LandingPage = () => {
  return (
    <main className="p-4">
      <LandingAnimator>
        <div data-anim="nav" className="invisible fixed inset-x-4 top-4 z-50">
          <div
            data-anim="nav-shell"
            className="rounded-2xl px-6 py-2 backdrop-blur-md transition-shadow"
          >
            <LandingNavbar />
          </div>
        </div>

        <section data-anim="stage" className="pointer-events-none relative">
          <div
            data-anim="frame"
            className="pointer-events-auto relative isolate h-[calc(100svh-2rem)] transform-gpu overflow-hidden rounded-2xl"
          >
            <div
              data-anim="image-wrap"
              className="absolute inset-x-0 top-0 h-[calc(100svh-2rem)]"
              style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
              <Image
                src="/auth_image.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="transform-gpu object-cover will-change-transform"
              />
              <div data-anim="overlay" className="absolute inset-0 bg-black opacity-20" />
            </div>

            <div
              data-anim="title"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[calc(100svh-2rem)] flex-col items-center justify-center gap-4 px-6 text-center text-white"
            >
              <h1 className="invisible text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                PACIFICO
              </h1>
              <p className="invisible max-w-md text-base text-white/80 md:text-lg">
                A simple way.
              </p>
            </div>
          </div>
        </section>

        <div data-anim="after" className="flex flex-col gap-4">
          <LandingHero />
          <LandingFeatures />
          <LandingReviews />
          <LandingFaq />
          <LandingContact />
        </div>
      </LandingAnimator>
    </main>
  );
};

export default LandingPage;
