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
    <ul className="flex flex-row flex-wrap items-center gap-8">
      {technologies.map((item) => (
        <li
          key={item.id}
          data-reveal-item
          className="flex flex-row items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <img
            src={item.icon}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={32}
            height={32}
            className="size-8 object-contain transition-transform duration-300 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
          <span className="text-sm text-neutral-700">{item.name}</span>
        </li>
      ))}
    </ul>
  );
};
