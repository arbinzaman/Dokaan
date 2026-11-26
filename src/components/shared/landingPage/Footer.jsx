import { socials } from "../../../constants/home/social";
import dokaan from "../../../assets/Home/logos/DOKAAN_FINAL.png";
import { Link } from "react-router-dom";
import { ArrowUpRight, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#080405] text-zinc-300 border-t border-red-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-red-950/70">
          <div className="max-w-md">
            <img
              src={dokaan}
              alt="Dokaan — এখন ডিজিটাল"
              className="w-52 object-contain mb-4 drop-shadow-[0_4px_16px_rgba(225,29,72,0.28)]"
            />
            <p className="text-sm text-zinc-400 leading-relaxed">
              আপনার দোকানকে ডিজিটাল করতে আজই শুরু করুন — স্মার্ট ইনভেন্টরি,
              বারকোড POS, কাস্টমার CRM ও রিয়েল-টাইম হিসাব এক প্ল্যাটফর্মে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-red-950/30 border border-red-900/70 text-white hover:border-red-700 hover:bg-red-950/55 transition-colors"
            >
              <Smartphone size={20} className="text-red-400" />
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-red-200/75">
                  Download For
                </span>
                <span className="text-sm font-semibold">Android APK</span>
              </span>
            </a>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors font-semibold text-sm shadow-lg shadow-red-950/40"
            >
              Open Web App
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Dokaan (দোকান — এখন ডিজিটাল). All rights
            reserved.
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
                    className="flex items-center justify-center w-9 h-9 bg-zinc-950 border border-red-950/80 rounded-full text-zinc-400 hover:text-red-300 hover:border-red-700 transition-colors"
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
