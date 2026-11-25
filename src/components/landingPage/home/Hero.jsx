import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import { useRef } from "react";
import dokaanLogo from "../../../assets/Home/logos/DOKAAN_FINAL.png";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[10rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 flex items-center justify-center text-n-1">
            <img
              src={dokaanLogo}
              alt="Dokaan Logo"
              className="w-64 sm:w-72 lg:w-96 items-center"
            />
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 font-semibold">
            ব্যবসার হিসাব রাখুন হাতের নাগালে!
          </p>
          <Button to="/signup">Get started</Button>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <BackgroundCircles parallaxRef={parallaxRef} />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
