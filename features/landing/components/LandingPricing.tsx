"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

const WHATSAPP_NUMBER = "523141192170"; 
interface PricingPlanConfig {
  id: "starter" | "pro" | "enterprise";
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  featureKeys: string[];
}

const PLANS_CONFIG: PricingPlanConfig[] = [
  {
    id: "starter",
    monthlyPrice: 299,
    annualPrice: 239,
    featureKeys: ["f1", "f2", "f3", "f4", "f5"],
  },
  {
    id: "pro",
    monthlyPrice: 599,
    annualPrice: 479,
    popular: true,
    featureKeys: ["f1", "f2", "f3", "f4", "f5"],
  },
  {
    id: "enterprise",
    monthlyPrice: 1199,
    annualPrice: 959,
    featureKeys: ["f1", "f2", "f3", "f4", "f5"],
  },
];

export default function LandingPricing() {
  const t = useTranslations("LandingPricing");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const pillRef = useRef<HTMLSpanElement>(null);
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef = useRef<HTMLButtonElement>(null);
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isFirstRender = useRef(true);

  const formatPrice = (amount: number) =>
    `$${amount.toLocaleString("es-MX")}`;

  // Sincroniza la posición y ancho de la píldora blanca con rebote GSAP
  useEffect(() => {
    const activeBtn =
      billingCycle === "monthly" ? monthlyBtnRef.current : annualBtnRef.current;
    const pill = pillRef.current;

    if (!activeBtn || !pill) return;

    if (isFirstRender.current) {
      gsap.set(pill, {
        x: activeBtn.offsetLeft - 4,
        width: activeBtn.offsetWidth,
      });
      isFirstRender.current = false;
      return;
    }

    gsap.to(pill, {
      x: activeBtn.offsetLeft - 4,
      width: activeBtn.offsetWidth,
      duration: 0.45,
      ease: "back.out(1.7)",
    });

    // Brinco en los números de precio al cambiar de ciclo
    gsap.fromTo(
      priceRefs.current.filter(Boolean),
      { y: 10, scale: 0.92, opacity: 0.4 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(2)",
      }
    );
  }, [billingCycle]);

  const handleToggleCycle = (cycle: "monthly" | "annual") => {
    const targetBtn =
      cycle === "monthly" ? monthlyBtnRef.current : annualBtnRef.current;

    if (targetBtn) {
      gsap.fromTo(
        targetBtn,
        { scale: 0.93 },
        { scale: 1, duration: 0.35, ease: "back.out(2.5)" }
      );
    }
    setBillingCycle(cycle);
  };

  // Brinco en los botones CTA de las cards
  const handleCtaEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: -3,
      scale: 1.02,
      duration: 0.3,
      ease: "back.out(2.5)",
    });
  };

  const handleCtaLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleCtaDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 0.96,
      y: 0,
      duration: 0.12,
      ease: "power2.out",
    });
  };

  return (
    <section
      id="precios"
      className="relative z-20 w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900 rounded-2xl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block px-3.5 py-1 mb-4 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 rounded-full">
            {t("badge")}
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {t("titleStart")}{" "}
            <span className="text-[#00B4D8]">{t("titleHighlight")}</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl">
            {t("subtitle")}
          </p>

          {/* Switch Mensual / Anual con píldora animada por GSAP */}
          <div className="relative mt-8 inline-flex items-center p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
            <span
              ref={pillRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-white dark:bg-neutral-900 shadow-sm"
            />

            <button
              ref={monthlyBtnRef}
              type="button"
              onClick={() => handleToggleCycle("monthly")}
              className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "monthly"
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {t("billing.monthly")}
            </button>

            <button
              ref={annualBtnRef}
              type="button"
              onClick={() => handleToggleCycle("annual")}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                billingCycle === "annual"
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <span>{t("billing.annual")}</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#00B4D8]/15 text-[#00B4D8]">
                {t("billing.discountBadge")}
              </span>
            </button>
          </div>
        </div>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS_CONFIG.map((plan, idx) => {
            const currentPrice =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const planName = t(`plans.${plan.id}.name`);
            const cycleLabel =
              billingCycle === "monthly"
                ? t("billing.monthly")
                : t("billing.annual");

            const whatsappMessage = t("whatsappMessage", {
              plan: planName,
              cycle: cycleLabel,
              price: formatPrice(currentPrice),
            });

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              whatsappMessage
            )}`;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-7 transition-colors duration-200 ${
                  plan.popular
                    ? "bg-white dark:bg-neutral-800/90 border-2 border-[#00B4D8] shadow-lg shadow-sky-500/10"
                    : "bg-[#FAFAFA] dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800/70 hover:shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3.5 py-1 text-xs font-semibold text-white bg-[#00B4D8] rounded-full shadow-sm">
                      {t("popularBadge")}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {planName}
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 min-h-[40px]">
                    {t(`plans.${plan.id}.description`)}
                  </p>

                  {/* Precio dinámico */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        ref={(el) => {
                          priceRefs.current[idx] = el;
                        }}
                        className="inline-block text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                      >
                        {formatPrice(currentPrice)}
                      </span>
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {t("perMonth")}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 h-4">
                      {billingCycle === "annual"
                        ? t("billedAnnually", {
                            total: formatPrice(currentPrice * 12),
                          })
                        : t("noCommitment")}
                    </p>
                  </div>

                  <hr className="my-6 border-neutral-200/80 dark:border-neutral-700/80" />

                  <ul className="space-y-3.5">
                    {plan.featureKeys.map((key) => (
                      <li
                        key={key}
                        className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            plan.popular
                              ? "bg-[#00B4D8]/15 text-[#00B4D8]"
                              : "bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>
                        <span>{t(`plans.${plan.id}.features.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón CTA hacia WhatsApp con brinco GSAP */}
                <div className="mt-8">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={handleCtaEnter}
                    onMouseLeave={handleCtaLeave}
                    onMouseDown={handleCtaDown}
                    className={`block w-full py-2.5 px-4 text-center text-sm font-semibold rounded-full transition-colors ${
                      plan.popular
                        ? "bg-[#00B4D8] text-white hover:bg-[#0096B4] shadow-sm"
                        : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {t(`plans.${plan.id}.cta`)}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}