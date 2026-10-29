import Image from "next/image";
import CursorFollower from "./CursorFollower";

const LandingHero = () => {
  return (
    <section className="rounded-3xl py-36">
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center rounded-2xl">
          <span className="py-1 px-4 rounded-2xl text-primary/70 bg-neutral-100 text">What do we solve?</span>
          <h1 className="text-5xl leading-tight font-bold">
            Human error, synchronization errors, <br/>decentralized data
          </h1>
          <CursorFollower />
          <p className="max-w-md text-xs text-neutral-600">
            These are among the biggest day-to-day operational challenges faced by small and medium sized enterprises.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;