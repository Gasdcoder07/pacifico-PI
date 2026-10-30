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
      className="grid scroll-mt-28 gap-6 rounded-3xl bg-[#CFE6FB] p-6 md:grid-cols-[1fr_1.4fr] md:p-10"
    >
      <div data-reveal-item className="flex flex-col justify-center gap-3">
        <span className="w-fit rounded-full bg-white/70 px-3 py-0.5 text-[10px] text-neutral-500">
          Contacts
        </span>
        <h2 className="text-3xl font-medium">
          Ready to organize <span className="text-[#3F73DC]">your company?</span>
        </h2>
        <p className="max-w-xs text-xs text-neutral-600">
          Leave your details and we will get in touch to help you set up your
          branches and your team.
        </p>
      </div>

      <form data-reveal-item className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.id} htmlFor={field.id} className="flex flex-col gap-1">
            <span className="text-[10px] text-neutral-500">{field.label}</span>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              className="rounded-xl bg-white px-4 py-3 text-xs outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#3F73DC]"
            />
          </label>
        ))}

        <label htmlFor="message" className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-[10px] text-neutral-500">Message</span>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about your company"
            className="resize-none rounded-xl bg-white px-4 py-3 text-xs outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#3F73DC]"
          />
        </label>

        <button
          type="button"
          className="rounded-full bg-neutral-900 px-6 py-3 text-xs text-white transition-colors hover:bg-neutral-800 sm:col-span-2 sm:w-fit"
        >
          Send message
        </button>
      </form>
    </section>
  );
};

export default LandingContact;
