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
      className="scroll-mt-28 px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        <div
          data-reveal-item
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="w-fit rounded-full bg-neutral-100 px-4 py-1 text-sm text-primary/70">
            How to use?
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            You can start to use it in{" "}<br />
            <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
        </div>

        <ol className="grid w-full gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li
              key={title}
              data-reveal-item
              className="group relative flex min-h-64 flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-white/60 backdrop-blur-xl transition-shadow"
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

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div
          data-reveal-item
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="text-base font-medium text-neutral-800 md:text-lg">
            Then, you are ready to manage!
          </p>
          <Link
            href="/login"
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
