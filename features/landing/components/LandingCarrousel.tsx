const path = "/technologies/"

const technologies = [
    {
        id: 1,
        name: "React JS",
        icon: `${path}react.webp`
    },
    {
        id: 2,
        name: "Next JS",
        icon: `${path}next.png`
    },
    {
        id: 3,
        name: "Tailwind CSS",
        icon: `${path}tailwind.webp`
    },
    {
        id: 4,
        name: "Supabase",
        icon: `${path}supabase.png`
    },
]

export const LandingCarrousel = () => {
    return (
        <div className="flex flex-row gap-8">
            {technologies.map((item) => (
                <div className="flex flex-row gap-2 items-center" key={item.id}>
                    <img src={item.icon} alt="icon" className="w-8 h-8 object-contain hover:scale-105 transition-all" />
                    <div className="">
                        {item.name}
                    </div>
                </div>
            ))}
        </div>
    )
}