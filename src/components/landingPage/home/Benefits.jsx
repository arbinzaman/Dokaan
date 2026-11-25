import { Link } from "react-router-dom";
import { benefits } from "../../../constants/home/benefits";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";

const Benefits = () => {
  return (
    <Section id="features">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="দোকানের সব কিছু, এখন এক প্ল্যাটফর্মে!"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {benefits.map((item) => (
            <div
              className="relative p-0.5 rounded-2xl bg-gradient-to-br from-n-6 via-color-1/30 to-n-6 hover:from-color-1/60 hover:to-color-5/60 transition-colors"
              key={item.id}
            >
              <div className="relative z-2 flex flex-col h-full min-h-[20rem] p-8 rounded-[15px] bg-n-8">
                <h5 className="h5 mb-4 text-n-1">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.icon}
                    width={48}
                    height={48}
                    alt={item.title}
                    className="object-contain"
                  />
                  <Link
                    to="/signup"
                    className="ml-auto inline-flex items-center gap-2 font-code text-xs font-bold text-n-1 hover:text-color-1 uppercase tracking-wider transition-colors"
                  >
                    Explore more
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                      <path d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
                    </svg>
                  </Link>
                </div>
              </div>

              {item.light && <GradientLight />}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
