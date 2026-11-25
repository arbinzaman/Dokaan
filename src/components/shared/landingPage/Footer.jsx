import { socials } from "../../../constants/home/social";
import dokaan from "../../../assets/Home/logos/DOKAAN_FINAL.png";
import { Link } from "react-router-dom";
import { ArrowUpRight, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-zinc-800/80">
          <div className="max-w-sm">
            <img
              src={dokaan}
              alt="Dokaan Logo"
              className="w-40 object-contain mb-3"
            />
            <p className="text-sm text-zinc-400 leading-relaxed">
              আপনার দোকানকে ডিজিটাল করতে আজই শুরু করুন — স্মার্ট ইনভেন্টরি,
              বারকোড POS ও রিয়েল-টাইম হিসাব এক প্ল্যাটফর্মে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-700 hover:bg-zinc-800/80 transition-colors"
            >
              <Smartphone size={20} className="text-emerald-400" />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                  Download For
                </span>
                <span className="text-sm font-semibold">Android APK</span>
              </span>
            </a>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold text-sm"
            >
              Open Web App
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Dokaan. All rights reserved.
          </p>

          <ul className="flex items-center gap-3">
            {socials
              .filter(({ url }) => url && url !== "#")
              .map(({ id, title, icon: Icon, url }) => (
                <li key={id}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={title}
                    className="flex items-center justify-center w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
