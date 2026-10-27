"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const faqs = [
  {
    question: "What is included in the trip?",
    answer:
      "Guided hikes, camping gear and meals during the whole program. You only need to bring your personal items.",
  },
  {
    question: "Is the trip suitable for beginners?",
    answer:
      "Yes. We have routes for every level, and our guides adapt the pace to the group.",
  },
  {
    question: "Can I join the trip alone?",
    answer:
      "Of course. Many of our travelers join solo and end up making new friends along the way.",
  },
  {
    question: "What do I need to have?",
    answer:
      "Comfortable hiking shoes, a light jacket and a reusable water bottle. We send the full list after you book.",
  },
];

const LandingFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="flex flex-col gap-8 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-neutral-100 px-3 py-0.5 text-[10px] text-neutral-500">
            FAQ
          </span>
          <h2 className="text-3xl font-medium">
            Frequently asked{" "}
            <span className="text-[#3F73DC]">questions</span>
          </h2>
        </div>
        <p className="max-w-xs text-xs text-neutral-600">
          Get the answers you need below. If you can&apos;t find them, reach out
          to us.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className={`rounded-2xl p-5 transition-colors ${
                isOpen ? "bg-[#3F73DC] text-white" : "bg-neutral-50 text-neutral-900"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    isOpen ? "bg-white text-[#3F73DC]" : "bg-neutral-900 text-white"
                  }`}
                >
                  {isOpen ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </span>
              </button>

              {isOpen && (
                <p className="mt-3 max-w-2xl text-xs text-white/80">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFaq;