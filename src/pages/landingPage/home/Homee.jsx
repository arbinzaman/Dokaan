import Header from "../../../components/shared/landingPage/Header";
import Hero from "../../../components/landingPage/home/Hero";
import Benefits from "../../../components/landingPage/home/Benefits";
import Collaboration from "../../../components/landingPage/home/Collaboration";
import Pricing from "../../../components/landingPage/home/Pricing";
import ButtonGradient from "../../../assets/svg/ButtonGradient";

const home = () => {
    return (
        <>
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <Header />
          <Hero />
          <Benefits />
          <Collaboration />
          {/* <Services /> */}
          <Pricing />
          {/* <Roadmap /> */}
        </div>
  
        <ButtonGradient />
      </>
    );
};

export default home;