"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const faqs = [
  {
    question: "What do I need to start using Pacifico?",
    answer:
      "Only your company details. You register the company, create your branches and invite your team, all from the same dashboard.",
  },
  {
    question: "Can I manage more than one branch?",
    answer:
      "Yes. Every branch keeps its own inventory and sales, and you still see the consolidated numbers of the whole company.",
  },
  {
    question: "How are roles and permissions handled?",
    answer:
      "Each employee gets a role, so people only see the operations they are responsible for inside their branch.",
  },
  {
    question: "Is my information synchronized?",
    answer:
      "Sales, inventory and employees share the same source of truth, so a change made in one place is reflected everywhere.",
  },
];

const LandingFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" data-reveal className="flex scroll-mt-28 flex-col gap-8 py-10">
      <div
        data-reveal-item
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
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
          const panelId = `faq-panel-${index}`;

          return (
            <div
              key={faq.question}
              data-reveal-item
              className={`rounded-2xl p-5 transition-colors ${
                isOpen ? "bg-[#3F73DC] text-white" : "bg-neutral-50 text-neutral-900"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? "bg-white text-[#3F73DC]" : "bg-neutral-900 text-white"
                  }`}
                >
                  {isOpen ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                </span>
              </button>

              <div
                id={panelId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-3 max-w-2xl text-xs text-white/80">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFaq;
