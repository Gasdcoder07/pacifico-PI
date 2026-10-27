import { Droplets, Tent, Mountain, Landmark } from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Stunning waterfalls",
    text: "Hike scenic trails to discover breathtaking waterfalls and hidden spots.",
    highlight: false,
  },
  {
    icon: Tent,
    title: "Camping under the stars",
    text: "Enjoy cozy nights in the mountains with a sky full of stars.",
    highlight: true,
  },
  {
    icon: Mountain,
    title: "Scenic hiking trails",
    text: "Explore diverse trails with stunning views and fresh air.",
    highlight: false,
  },
  {
    icon: Landmark,
    title: "Cultural exploration",
    text: "Visit charming villages and learn about local traditions.",
    highlight: false,
  },
];

const LandingFeatures = () => {
  return (
    <section id="features" className="flex flex-col items-center gap-8 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-[10px] text-neutral-500">
          Features
        </span>
        <h2 className="text-3xl font-medium">
          <span className="text-[#3F73DC]">Elevate your well-being.</span>
          <br />
          Go to the mountains!
        </h2>
        <p className="max-w-md text-xs text-neutral-600">
          Enhance your adventure with waterfall hikes, thrilling exploration
          and serene mountain views.
        </p>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, highlight }) => (
          <div
            key={title}
            className={`flex min-h-[200px] flex-col justify-between rounded-2xl p-4 ${
              highlight ? "bg-[#3F73DC] text-white" : "bg-neutral-50 text-neutral-900"
            }`}
          >
            <Icon size={20} className={highlight ? "self-end text-white" : "self-end text-[#3F73DC]"} />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className={`text-[11px] ${highlight ? "text-white/80" : "text-neutral-500"}`}>
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;