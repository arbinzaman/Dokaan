import Hero from "../../../components/landingPage/home/Hero";
import Benefits from "../../../components/landingPage/home/Benefits";
import Collaboration from "../../../components/landingPage/home/Collaboration";
import Pricing from "../../../components/landingPage/home/Pricing";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Benefits />
      <Collaboration />
      <Pricing />
    </div>
  );
};

export default Home;
