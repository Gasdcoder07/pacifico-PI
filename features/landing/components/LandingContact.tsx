const fields = [
  { id: "firstName", label: "First name", type: "text", placeholder: "First name" },
  { id: "lastName", label: "Last name", type: "text", placeholder: "Last name" },
  { id: "email", label: "Email", type: "email", placeholder: "Email" },
  { id: "phone", label: "Phone", type: "tel", placeholder: "Phone" },
];

const LandingContact = () => {
  return (
    <section
      id="contacts"
      data-reveal
      className="scroll-mt-28 rounded-2xl bg-[#CFE6FB] px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr]">
        <div data-reveal-item className="flex flex-col justify-center gap-4">
          <span className="w-fit rounded-full bg-white/70 px-4 py-1 text-sm text-neutral-500">
            Contacts
          </span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Ready to organize <span className="text-[#3F73DC]">your company?</span>
          </h2>
          <p className="max-w-md text-base text-neutral-600 md:text-lg">
            Leave your details and we will get in touch to help you set up your
            branches and your team.
          </p>
        </div>

        <form data-reveal-item className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.id} htmlFor={field.id} className="flex flex-col gap-2">
              <span className="text-sm text-neutral-500">{field.label}</span>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="rounded-xl bg-white px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#3F73DC]"
              />
            </label>
          ))}

          <label htmlFor="message" className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm text-neutral-500">Message</span>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us about your company"
              className="resize-none rounded-xl bg-white px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#3F73DC]"
            />
          </label>

          <button
            type="button"
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 sm:col-span-2 sm:w-fit"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default LandingContact;
