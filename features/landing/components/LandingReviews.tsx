import Link from "next/link";
import { LandingCarrousel } from "./LandingCarrousel";
import { FaGithub } from "react-icons/fa"

const LandingReviews = () => {
  return (
    <section
      id="reviews"
      data-reveal
      className="flex bg-neutral-100 rounded-2xl scroll-mt-28 flex-col gap-8 py-10 pl-36"
    >
      <div
        data-reveal-item
        className="flex flex-col gap-2"
      >
        <h2 className="text-6xl font-bold">
          {"Manage your operations and "} <br/>{"finances in a"} 
          <span className="text-cyan-600/40"> Simple way.</span>
        </h2>
        <p className="max-w-md text-lg text-neutral-600">
          Set it up once, use it anywhere
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 items-start">
        <h2 className="text-lg font-medium">Built in</h2>
        <LandingCarrousel />
        <Link href="https://github.com/Gasdcoder07/pacifico-PI.git" className="mt-4 bg-neutral-900 text-neutral-100 py-2 px-4 rounded-2xl cursor-pointer hover:scale-105 transition-all flex flex-row items-center gap-2">
          <FaGithub />
          Apoya el repositorio!
        </Link>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-3">
        
      </div>
    </section>
  );
};

export default LandingReviews;
