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
              className="rounded-2xl px-4 transition-shadow"
            >
              <LandingNavbar />
            </div>
          </div>

          <section data-anim="stage" className="pointer-events-none relative">
            <div
              data-anim="frame"
              className="pointer-events-auto relative isolate h-[calc(100svh-2rem)] overflow-hidden rounded-2xl"
            >
              <div
                data-anim="image-wrap"
                className="absolute inset-0 [clip-path:inset(0%_0%_100%_0%)]"
              >
                <Image
                  src="/auth_image.webp"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div data-anim="overlay" className="absolute inset-0 bg-black opacity-20" />
              </div>

              <div
                data-anim="title"
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4 text-center text-white"
              >
                <h1 className="invisible text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                  PACIFICO
                </h1>
                <p className="invisible max-w-xl text-base text-white/80 sm:text-lg">
                  A simple way.
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6 pt-6">
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
