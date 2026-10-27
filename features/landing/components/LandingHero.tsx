import Image from "next/image";

const stats = [
  { value: "10k+", label: "Happy customers", highlight: true },
  { value: "1k+", label: "Wonderful adventures", highlight: false },
  { value: "10+", label: "Waterfalls were visited", highlight: false },
];

const LandingHero = () => {
  return (
    <section className="grid gap-3 rounded-3xl bg-[#CFE6FB] p-3 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-1 flex-col justify-center gap-4 rounded-2xl bg-white p-8">
          <h1 className="text-5xl font-medium leading-tight">
            Adventure <br /> of your lifetime
          </h1>
          <p className="max-w-md text-xs text-neutral-600">
            Explore scenic trails to magnificent waterfalls, surrounded by lush
            landscapes that invigorate your senses.
          </p>
          <div className="flex gap-2">
            <button className="rounded-full bg-neutral-900 px-4 py-2 text-xs text-white">
              Reserve a spot
            </button>
            <button className="rounded-full border border-neutral-300 px-4 py-2 text-xs">
              Get a consultation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className={`flex flex-col gap-1 rounded-2xl p-4 ${
                stat.highlight ? "bg-[#3F73DC] text-white" : "bg-[#E3F0FC] text-[#3F73DC]"
              }`}
            >
              <span className="text-2xl font-medium">{stat.value}</span>
              <span className="text-[10px] opacity-80">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid min-h-[420px] grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-2xl">
          <Image src="/auth_image.webp" alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover object-left" />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <Image src="/auth_image.webp" alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover object-right" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;