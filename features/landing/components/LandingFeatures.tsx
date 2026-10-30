import Link from "next/link";
import { Building2, Store, Users } from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "Register your company",
    description: "Fill some fields, and press enter!",
  },
  {
    icon: Store,
    title: "Set your management",
    description: "Create some branches!",
  },
  {
    icon: Users,
    title: "Add your employees",
    description: "Add all your people!",
  },
];

const LandingFeatures = () => {
  return (
    <section
      id="features"
      data-reveal
      className="flex scroll-mt-28 flex-col items-center gap-8 px-2"
    >
      <div
        data-reveal-item
        className="flex max-w-2xl flex-col items-center gap-3 text-center"
      >
        <span className="rounded-2xl bg-neutral-100 px-4 py-1 text-sm text-primary/70">
          How to use?
        </span>
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          You can start to use it in{" "}<br />
          <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
            3 simple steps
          </span>
        </h2>
      </div>

      <div className="w-full rounded-3xl p-4 sm:p-6">
        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              data-reveal-item
              className="group relative flex flex-col justify-between gap-4 rounded-2xl bg-white min-h-64 p-6 shadow-sm ring-1 ring-white/60 backdrop-blur-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                  <Icon className="size-6" aria-hidden />
                </div>
                <span
                  aria-hidden
                  className="text-7xl font-bold leading-none text-neutral-200 transition-colors group-hover:text-neutral-400"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div
        data-reveal-item
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="flex items-center gap-2 text-lg font-medium text-neutral-800">
          Then, you are ready to manage!
        </p>
        <Link
          href="/login"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Get started
        </Link>
      </div>
    </section>
  );
};

export default LandingFeatures;