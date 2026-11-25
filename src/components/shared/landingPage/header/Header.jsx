import { useUser } from "../../../../contexts/AuthContext";
import NavList from "./NavList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Menu, Play, X } from "lucide-react";
import fullLogo from "../../../../assets/Home/logos/DOKAAN_FINAL.png";
import { activateDemoSession } from "../../../../demo/mockServer";

const Header = () => {
  const { user, logout, setUser, setDokaan, selectShop } = useUser();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openNavigation, setOpenNavigation] = useState(false);

  const closeNavigation = useCallback(() => {
    setOpenNavigation(false);
    enablePageScroll();
  }, []);

  const handleLaunchDemo = () => {
    closeNavigation();
    const session = activateDemoSession("owner@dokaan.demo");
    setUser(session.user);
    setDokaan(session.dokaan);
    selectShop(session.savedShop);
    queryClient.clear();
    toast.success("Entered Interactive Demo as Shop Owner!");
    navigate("/dashboard");
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      closeNavigation();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  useEffect(() => {
    closeNavigation();
  }, [pathname, closeNavigation]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) closeNavigation();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      enablePageScroll();
    };
  }, [closeNavigation]);

  const handleSectionNavigation = (section) => {
    closeNavigation();
    if (pathname !== "/") {
      navigate(`/#${section}`);
    } else {
      try {
        const target = document.querySelector(`#${section}`);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } catch {
        // ignore invalid selector
      }
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
    <header className="fixed top-0 left-0 w-full z-50 border-b border-red-950/70 bg-[#0a0607]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={closeNavigation}
          className="flex items-center flex-shrink-0 group"
          aria-label="Dokaan Home"
        >
          <img
            src={fullLogo}
            alt="Dokaan — এখন ডিজিটাল"
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(225,29,72,0.28)] group-hover:scale-[1.02] transition-transform"
          />
        </Link>

        <NavList
          handleSectionNavigation={handleSectionNavigation}
          handleClick={closeNavigation}
          openNavigation={openNavigation}
          onLaunchDemo={handleLaunchDemo}
        />

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-red-950/40"
              >
                Dashboard
                <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white border border-red-950/80 hover:border-red-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <button
                type="button"
                onClick={handleLaunchDemo}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-red-950/40"
              >
                <Play size={13} className="fill-white" />
                Live Demo
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleNavigation}
          aria-label="Toggle navigation"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-red-950/80 text-zinc-200 hover:bg-red-950/40 transition-colors"
        >
          {openNavigation ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
