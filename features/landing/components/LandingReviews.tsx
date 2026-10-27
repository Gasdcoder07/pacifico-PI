import { Quote } from "lucide-react";

const reviews = [
  {
    tag: "2024 • May trip",
    text: "The trip exceeded my expectations. The trails were breathtaking and the guides were friendly and very supportive.",
    name: "Sam Walker",
    role: "Photographer",
    highlight: true,
  },
  {
    tag: "2024 • June trip",
    text: "As a solo traveler, I was nervous at first, but the welcoming atmosphere made me feel at home from day one.",
    name: "Riley Evans",
    role: "Designer",
    highlight: false,
  },
  {
    tag: "2024 • August trip",
    text: "This retreat was a profound journey: exploration, nature and adventure fostered deep connection with myself.",
    name: "Olivia Carter",
    role: "Dancer",
    highlight: false,
  },
];

const LandingReviews = () => {
  return (
    <section id="reviews" className="flex flex-col items-center gap-8 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-[10px] text-neutral-500">
          Reviews
        </span>
        <h2 className="text-3xl font-medium">
          What our <span className="text-[#3F73DC]">customers feel</span>
          <br />
          about us
        </h2>
        <p className="max-w-md text-xs text-neutral-600">
          We love hearing from the people who joined us. Their experiences
          show the quality and impact of what we do.
        </p>
      </div>

      <div className="grid w-full gap-3 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.name}
            className={`flex min-h-[260px] flex-col justify-between gap-6 rounded-2xl p-5 ${
              review.highlight ? "bg-[#3F73DC] text-white" : "bg-neutral-50 text-neutral-900"
            }`}
          >
            <div className="flex flex-col gap-3">
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] ${
                  review.highlight ? "bg-white/20" : "bg-white text-neutral-500"
                }`}
              >
                {review.tag}
              </span>
              <p className={`text-xs ${review.highlight ? "text-white/90" : "text-neutral-600"}`}>
                {review.text}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-medium ${
                    review.highlight ? "bg-white/20" : "bg-[#CFE6FB] text-[#3F73DC]"
                  }`}
                >
                  {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{review.name}</span>
                  <span className={`text-[10px] ${review.highlight ? "text-white/70" : "text-neutral-500"}`}>
                    {review.role}
                  </span>
                </div>
              </div>
              <Quote size={18} className={review.highlight ? "text-white" : "text-[#3F73DC]"} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingReviews;