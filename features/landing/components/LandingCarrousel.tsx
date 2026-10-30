const path = "/technologies/";

const technologies = [
  {
    id: 1,
    name: "React JS",
    icon: `${path}react.webp`,
  },
  {
    id: 2,
    name: "Next JS",
    icon: `${path}next.png`,
  },
  {
    id: 3,
    name: "Tailwind CSS",
    icon: `${path}tailwind.webp`,
  },
  {
    id: 4,
    name: "Supabase",
    icon: `${path}supabase.png`,
  },
];

export const LandingCarrousel = () => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-8">
      {technologies.map((item) => (
        <div key={item.id} className="flex flex-row items-center gap-2">
          <img
            src={item.icon}
            alt=""
            aria-hidden
            className="size-8 object-contain transition-transform hover:scale-105"
          />
          <span className="text-sm text-neutral-700">{item.name}</span>
        </div>
      ))}
    </div>
  );
};
