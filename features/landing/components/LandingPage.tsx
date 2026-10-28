import Image from "next/image";

import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingReviews from "./LandingReviews";
import LandingFaq from "./LandingFaq";
import LandingContact from "./LandingContact";

const LandingPage = () => {

  return (
    <main className="p-4">
      <section className="relative isolate flex min-h-[calc(100svh-2rem)] flex-col gap-6 overflow-hidden rounded-2xl p-4">
        <Image
          src="/auth_image.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/20" />

        <LandingNavbar />

        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-white">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            PACIFICO
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            A simple way.
          </p>
        </div>
      </section>
    </main>
  )

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <div className="absolute w-full top-0 left-0 bg-linear-to-b from-[#CFE6FB] to-white min-h-64 -z-50"/>
      <LandingNavbar />
      <div className="max-w-7xl mx-auto">
        <LandingHero />
        <LandingFeatures />
        <LandingReviews />
        <LandingFaq />
        <LandingContact />
      </div>
    </main>
  );
};

export default LandingPage;