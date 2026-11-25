import { Link } from "react-router-dom";
import Section from "./Section";
import smallSphere from "../../../assets/Home/4-small.png";
import stars from "../../../assets/Home/pricing/stars.svg";
import Heading from "./Heading";
import PricingList from "./PricingList";
import { LeftLine, RightLine } from "./design/Pricing";

const Pricing = () => {
  return (
    <Section className="overflow-hidden" id="pricing">
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1"
            width={255}
            height={255}
            alt="Sphere"
          />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div>

        <Heading
          tag="দোকানে যোগ দিন, সহজ প্ল্যানে সব সুবিধা ব্যবহার করুন"
          title="পেমেন্ট একবার, নিশ্চিন্ত সারা মাস"
        />

        <div className="relative">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div>

        <div className="flex justify-center mt-10">
          <Link
            className="text-xs font-code font-bold tracking-wider uppercase border-b border-n-1/50 hover:text-color-1 hover:border-color-1 transition-colors"
            to="/signup"
          >
            Start your free trial
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
