import { useUser } from "../../../../contexts/AuthContext";
import { useLanguage } from "../../../../contexts/LanguageContext";
import NavList from "./NavList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Download, Menu, Play, X } from "lucide-react";
import fullLogo from "../../../../assets/Home/logos/DOKAAN_FINAL.png";
import { activateDemoSession } from "../../../../demo/mockServer";
import LanguageToggle from "../../LanguageToggle";

const Header = () => {
  const { user, logout, setUser, setDokaan, selectShop } = useUser();
  const { pick } = useLanguage();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openNavigation, setOpenNavigation] = useState(false);

  const closeNavigation = useCallback(() => {
    setOpenNavigation(false);
  }, []);

  const handleLaunchDemo = () => {
    closeNavigation();
    const session = activateDemoSession("owner@dokaan.demo");
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success(
      pick(
        "Entered Interactive Demo as Shop Owner!",
        "দোকান মালিক হিসেবে ডেমো চালু হয়েছে!"
      )
    );
    navigate("/dashboard");
  };

  const toggleNavigation = () => {
    setOpenNavigation((prev) => !prev);
  };

  useEffect(() => {
    closeNavigation();
  }, [pathname, closeNavigation]);

  // Lock background page scroll cleanly when mobile menu is open
  useEffect(() => {
    if (openNavigation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openNavigation]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) closeNavigation();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeNavigation();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeNavigation]);

  const handleSectionNavigation = (section) => {
    closeNavigation();
    if (pathname !== "/") {
      navigate(`/#${section}`);
    } else {
      setTimeout(() => {
        try {
          const target = document.querySelector(`#${section}`);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        } catch {
          // ignore invalid selector
        }
      }, 60);
    }
  };

  useEffect(() => {
    if (pathname === "/" && hash) {
      try {
        const section = document.querySelector(hash);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } catch {
        // ignore malformed hash
      }
    }
  }, [pathname, hash]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-red-950/70 bg-[#0a0607]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <Link
            to="/"
            onClick={closeNavigation}
            className="flex items-center flex-shrink-0 group"
            aria-label="Dokaan Home"
          >
            <img
              src={fullLogo}
              alt="Dokaan — এখন ডিজিটাল"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(225,29,72,0.28)] group-hover:scale-[1.02] transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavList
            handleSectionNavigation={handleSectionNavigation}
            handleClick={closeNavigation}
          />

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <LanguageToggle variant="landing" />

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-red-950/40"
                >
                  {pick("Dashboard", "ড্যাশবোর্ড")}
                  <ArrowRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white border border-red-950/80 hover:border-red-800 transition-colors"
                >
                  {pick("Logout", "লগআউট")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {pick("Sign in", "লগইন")}
                </Link>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-red-950/40"
                >
                  <Play size={13} className="fill-white" />
                  {pick("Live Demo", "লাইভ ডেমো")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls: EN/BN switch + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle variant="landing" />
            <button
              type="button"
              onClick={toggleNavigation}
              aria-expanded={openNavigation}
              aria-label={
                openNavigation
                  ? pick("Close menu", "মেনু বন্ধ করুন")
                  : pick("Open menu", "মেনু খুলুন")
              }
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-red-900/80 bg-red-950/30 text-white hover:bg-red-950/60 transition-colors"
            >
              {openNavigation ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay (rendered OUTSIDE header so backdrop-blur never clips it!) */}
      {openNavigation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 top-20 z-[60] bg-[#0a0607] text-white overflow-y-auto px-5 py-6 flex flex-col justify-between border-t border-red-950/70"
        >
          <div className="space-y-1.5">
            {[
              { id: "features", label: pick("All 14 Features", "সব ১৪টি ফিচার") },
              { id: "industries", label: pick("Industries & Roles", "ব্যবসার ধরন ও রোল") },
              { id: "workflow", label: pick("How It Works", "কাজের ধাপ") },
              { id: "pricing", label: pick("Pricing", "মূল্য তালিকা") },
              { id: "faq", label: pick("FAQ", "প্রশ্নোত্তর") },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSectionNavigation(item.id)}
                className="w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold text-zinc-100 hover:bg-red-950/40 hover:text-red-300 border border-transparent hover:border-red-900/50 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <a
              href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeNavigation}
              className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-base font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <Download size={18} />
              {pick("Download Android App (APK)", "অ্যান্ড্রয়েড অ্যাপ ডাউনলোড")}
            </a>
          </div>

          <div className="pt-6 mt-6 border-t border-red-950/80 space-y-3 pb-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeNavigation}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors"
                >
                  {pick("Open Dashboard", "ড্যাশবোর্ডে যান")}
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeNavigation();
                    logout();
                  }}
                  className="w-full py-3.5 rounded-xl border border-red-900/80 text-zinc-200 hover:bg-red-950/40 font-medium text-sm transition-colors"
                >
                  {pick("Logout", "লগআউট")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-950/50"
                >
                  <Play size={15} className="fill-white" />
                  {pick("Try Interactive Demo", "লাইভ ডেমো দেখুন")}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeNavigation}
                    className="text-center py-3 rounded-xl border border-red-900/80 bg-zinc-950 text-white font-semibold text-sm hover:bg-red-950/40 transition-colors"
                  >
                    {pick("Sign In", "লগইন")}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeNavigation}
                    className="text-center py-3 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors"
                  >
                    {pick("Register Free", "রেজিস্ট্রেশন")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
