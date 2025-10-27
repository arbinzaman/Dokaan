import Hero from "../../../components/landingPage/home/Hero";
import Benefits from "../../../components/landingPage/home/Benefits";
import Collaboration from "../../../components/landingPage/home/Collaboration";
import Pricing from "../../../components/landingPage/home/Pricing";

const home = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Hero />
        <Benefits />
        <Collaboration />
        {/* <Services /> */}
        <Pricing />
        {/* <Roadmap /> */}
      </div>

      <svg className="block" width={0} height={0}>
        <defs>
          <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#89F9E8" />
            <stop offset="100%" stopColor="#FACB7B" />
          </linearGradient>
          <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
            <stop offset="0%" stopColor="#D87CEE" />
            <stop offset="100%" stopColor="#FACB7B" />
          </linearGradient>
          <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
            <stop offset="0%" stopColor="#9099FC" />
            <stop offset="100%" stopColor="#89F9E8" />
          </linearGradient>
          <linearGradient
            id="btn-right"
            x1="14.635%"
            x2="14.635%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#9099FC" />
            <stop offset="100%" stopColor="#D87CEE" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};

export default home;
