import { FaGithub } from "react-icons/fa";

const authors = [
  {
    name: "Greco Serna",
    gh: "https://github.com/Gasdcoder07"
  }, {
    name: "Valentín Vaca",
    gh: "https://github.com/valent-x7"
  }, {
    name: "Manuel Martínez",
    gh: "https://github.com/IsahitMartinez"
  }, {
    name: "Nelvín Frías",
    gh: "https://github.com/nelvinfrias"
  }, {
    name: "Brian Sebastián",
    gh: "https://github.com/BSebastian-IS"
  }, {
    name: "Ángel Arres",
    gh: "https://github.com/4NGEL3MANUEL"
  }
]


const LandingContact = () => {
  return (
    <section
      id="contacts"
      data-reveal
      className="scroll-mt-28 rounded-2xl bg-neutral-100 px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 grid-cols-2">
        <div data-reveal-item className="flex flex-col justify-center gap-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Ready to organize <span className="bg-linear-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">your company?</span>
          </h2>
          <p className="max-w-md text-base text-neutral-600 md:text-lg">
            Leave your details and we will get in touch to help you set up your
            branches and your team.
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-2">
            <img src="/pacifico-logo.svg" alt="logo-footer" className="max-w-24" />
            <h1 className="text-2xl font-bold">PACIFICO</h1>
          </div>
          <p className="">Easy management of complex operations through software and centralized data.</p>
          <h3>Authors</h3>
          <div className="gap-2 grid grid-cols-3">
            {authors.map(author => (
              <div key={author.name} className="bg-white rounded-2xl flex flex-row items-center p-2 gap-2">
                <FaGithub />
                <span className="text-xs">{author.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingContact;
