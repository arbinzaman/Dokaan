import Section from "../../../components/landingPage/home/Section";
import { socials } from "../../../constants/home/social";
import dokaan from "../../../assets/Home/logos/DOKAAN_FINAL.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="py-6 text-n-1">
        <div className="container mx-auto flex flex-col justify-around p-4 text-center md:p-10 lg:flex-row items-center gap-8">
          <div className="flex flex-col lg:items-start items-center text-center lg:text-left">
            <p className="mb-2 text-sm font-medium tracking-wider uppercase text-n-3">
              আপনার দোকানকে ডিজিটাল করতে আজই ডাউনলোড করুন
            </p>
            <img
              src={dokaan}
              width="220"
              className="object-contain"
              alt="Dokaan Logo"
            />
          </div>

          <div className="flex flex-col items-center justify-center flex-shrink-0 gap-3 sm:flex-row">
            <a
              href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-n-7 border border-n-6 text-n-1 hover:bg-n-6 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="fill-current w-6 h-6 text-n-1"
              >
                <path d="M 5.4160156 2.328125 L 12.935547 10.158203 C 13.132547 10.363203 13.45925 10.363203 13.65625 10.158203 L 15.179688 8.5742188 C 15.405688 8.3392188 15.354312 7.956875 15.070312 7.796875 C 11.137313 5.571875 6.2620156 2.811125 5.4160156 2.328125 z M 3.140625 2.8476562 C 3.055625 3.0456562 3 3.2629063 3 3.5039062 L 3 20.591797 C 3 20.788797 3.044375 20.970625 3.109375 21.140625 L 11.576172 12.324219 C 11.762172 12.131219 11.762172 11.826813 11.576172 11.632812 L 3.140625 2.8476562 z M 17.443359 9.2578125 C 17.335484 9.2729375 17.233297 9.32375 17.154297 9.40625 L 15.015625 11.632812 C 14.829625 11.825812 14.829625 12.130219 15.015625 12.324219 L 17.134766 14.529297 C 17.292766 14.694297 17.546141 14.729188 17.744141 14.617188 C 19.227141 13.777188 20.226563 13.212891 20.226562 13.212891 C 20.725562 12.909891 21.007 12.443547 21 11.935547 C 20.992 11.439547 20.702609 10.981938 20.224609 10.710938 C 20.163609 10.676937 19.187672 10.124359 17.763672 9.3183594 C 17.664172 9.2623594 17.551234 9.2426875 17.443359 9.2578125 z M 13.296875 13.644531 C 13.165875 13.644531 13.034047 13.696328 12.935547 13.798828 L 5.4746094 21.566406 C 6.7566094 20.837406 11.328781 18.249578 15.050781 16.142578 C 15.334781 15.981578 15.386156 15.599281 15.160156 15.363281 L 13.65625 13.798828 C 13.55775 13.696328 13.427875 13.644531 13.296875 13.644531 z" />
              </svg>
              <span className="flex flex-col items-start ml-3 leading-none">
                <span className="mb-1 text-[10px] text-n-3">GET IT ON</span>
                <span className="text-sm font-semibold">Android APK</span>
              </span>
            </a>

            <Link
              to="/signup"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-n-7 border border-n-6 text-n-1 hover:bg-n-6 transition-colors"
            >
              <span className="flex flex-col items-start leading-none">
                <span className="mb-1 text-[10px] text-n-3">USE ON ANY DEVICE</span>
                <span className="text-sm font-semibold">Web Dashboard</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container flex sm:justify-between justify-center items-center gap-6 max-sm:flex-col pt-6 border-t border-n-6">
        <p className="caption text-n-4">
          © {new Date().getFullYear()} Dokaan. All rights reserved.
        </p>

        <ul className="flex gap-4 flex-wrap">
          {socials
            .filter(({ url }) => url && url !== "#")
            .map(({ id, title, icon: Icon, url }) => (
              <li key={id}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  className="flex items-center justify-center w-10 h-10 bg-n-7 border border-n-6 rounded-full transition-colors hover:bg-n-6 text-n-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              </li>
            ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;
