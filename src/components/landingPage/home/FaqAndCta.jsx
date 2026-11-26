import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowRight, ChevronDown, Play, Smartphone } from "lucide-react";
import fullLogo from "../../../assets/Home/logos/DOKAAN_FINAL.png";
import { useUser } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { activateDemoSession } from "../../../demo/mockServer";

const FAQS = [
  {
    q: "Do I need an expensive barcode scanner or POS machine to use Dokaan?",
    a: "No. Dokaan includes a built-in camera barcode & QR scanner that works directly on your smartphone or laptop webcam, plus manual barcode entry and 1-click shelf quick-add chips. You can also connect any standard USB barcode scanner whenever you want.",
  },
  {
    q: "Can I print both 92mm thermal POS receipts and full-page A4 invoices?",
    a: "Yes. Every completed sale automatically generates a formatted invoice that you can preview in 92mm Thermal POS mode or full A4 mode, print directly to your printer, or export as a clean PDF to share on WhatsApp or email.",
  },
  {
    q: "Can one shop owner manage multiple branches from the same account?",
    a: "Yes. Shop Owners can add multiple branches under one account and switch active shops anytime from the top workspace bar or shop selector — each branch keeps its own inventory, sales, invoices, staff, and P&L analytics.",
  },
  {
    q: "How does Dokaan calculate daily or monthly net profit?",
    a: "Dokaan combines your recorded POS sales and extra income against both recurring fixed monthly costs (rent, electricity, internet) and variable daily expenses (transport, packaging, maintenance) to show live Revenue, Expenses, and Net Profit by day, week, month, or year.",
  },
  {
    q: "Will my cashier or staff see my confidential profit reports?",
    a: "No. Employee accounts get a dedicated counter workspace focused on POS billing, product search, and receipts, while owner-only analytics, shop management, and staff payroll remain protected.",
  },
  {
    q: "How can I try every feature right now without creating an account?",
    a: "Click 'Try Interactive Demo' anywhere on this page. It opens a fully populated multi-branch demo running offline in your browser — you can scan items, complete sales, print/download PDF receipts, mark bills paid, switch roles, and reset data anytime.",
  },
];

const FaqAndCta = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser, setDokaan, selectShop } = useUser();
  const { pick } = useLanguage();

  const handleLaunchDemo = () => {
    const session = activateDemoSession("owner@dokaan.demo");
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success("Entered Interactive Demo as Shop Owner!");
    navigate("/dashboard");
  };

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
              {pick("Frequently Asked Questions", "সাধারণ প্রশ্ন ও উত্তর")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {pick("Simple answers to common questions", "সব সাধারণ প্রশ্নের সহজ উত্তর")}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              {pick(
                "Everything you need to know about setting up and running your business with Dokaan.",
                "দোকান অ্যাপ ব্যবহার শুরু করা ও চালানোর সব প্রয়োজনীয় তথ্য এখানে জানুন।"
              )}
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? "border-red-600/60 bg-red-950/20"
                      : "border-red-950/70 bg-zinc-950/70 hover:border-red-900/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-red-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 text-sm text-zinc-300 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Signature Red CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-red-600/40 bg-gradient-to-br from-red-950/75 via-[#18090c] to-zinc-950 p-8 sm:p-12 text-center shadow-2xl shadow-red-950/40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-56 rounded-full bg-red-600/20 blur-3xl"
          />

          <div className="relative max-w-2xl mx-auto">
            <img
              src={fullLogo}
              alt="Dokaan — এখন ডিজিটাল"
              className="h-20 sm:h-24 w-auto mx-auto mb-6 object-contain drop-shadow-[0_6px_20px_rgba(225,29,72,0.35)]"
            />
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to modernize your shop today?
            </h2>
            <p className="mt-3 text-base text-red-100/90 font-medium">
              আজই আপনার দোকানকে ডিজিটাল করুন — ১ বছর সম্পূর্ণ ফ্রি ট্রায়াল!
            </p>
            <p className="mt-2 text-sm text-zinc-300">
              Jump straight into the live interactive demo or create your own
              store workspace in under two minutes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-xl shadow-red-950/50"
                >
                  {pick("Open My Dashboard", "আমার ড্যাশবোর্ডে যান")}
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleLaunchDemo}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-xl shadow-red-950/50"
                  >
                    <Play size={15} className="fill-white" />
                    {pick("Launch Interactive Demo", "লাইভ ডেমো চালু করুন")}
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-colors"
                  >
                    {pick("Create Free Account", "ফ্রি অ্যাকাউন্ট খুলুন")}
                  </Link>
                </>
              )}
              <a
                href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-red-800/80 bg-red-950/40 text-red-100 hover:bg-red-950/70 font-medium text-sm transition-colors"
              >
                <Smartphone size={16} className="text-red-400" />
                {pick("Android APK", "অ্যান্ড্রয়েড অ্যাপ")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAndCta;
