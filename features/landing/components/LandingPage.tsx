import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingReviews from "./LandingReviews";
import LandingFaq from "./LandingFaq";
import LandingContact from "./LandingContact";

const LandingPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingReviews />
      <LandingFaq />
      <LandingContact />
    </main>
  );
};

export default LandingPage;