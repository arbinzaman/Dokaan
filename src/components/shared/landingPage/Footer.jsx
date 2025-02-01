import Section from "../../../components/landingPage/home/Section";
import { socials } from "../../../constants/home/social";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. All rights reserved.
        </p>

        <ul className="flex gap-5 flex-wrap">
          {socials.map(({ id,  icon: Icon, url }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
            >
              <Icon className="w-5 h-5 text-white" />{" "}
              {/* ✅ Correct way to render React icons */}
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;
