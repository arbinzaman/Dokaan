import Hero from "../../../components/landingPage/home/Hero";
import Benefits from "../../../components/landingPage/home/Benefits";
import ShopTypesAndDetails from "../../../components/landingPage/home/ShopTypesAndDetails";
import Collaboration from "../../../components/landingPage/home/Collaboration";
import Pricing from "../../../components/landingPage/home/Pricing";
import FaqAndCta from "../../../components/landingPage/home/FaqAndCta";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Benefits />
      <ShopTypesAndDetails />
      <Collaboration />
      <Pricing />
      <FaqAndCta />
    </div>
  );
};

export default Home;
