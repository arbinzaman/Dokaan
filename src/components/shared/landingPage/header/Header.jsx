import { useUser } from "../../../../contexts/AuthContext";
import NavList from "./NavList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import finalLogo from "../../../../assets/Home/logos/DOKAAN Only D.png";

const Header = () => {
  const { user, logout } = useUser();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  const closeNavigation = useCallback(() => {
    setOpenNavigation(false);
    enablePageScroll();
  }, []);

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
    <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={closeNavigation}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <img src={finalLogo} alt="Dokaan" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-tight text-white">
            Dokaan
          </span>
        </Link>

        <NavList
          handleSectionNavigation={handleSectionNavigation}
          handleClick={closeNavigation}
          openNavigation={openNavigation}
        />

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
              >
                Dashboard
                <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors"
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
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleNavigation}
          aria-label="Toggle navigation"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-800 text-zinc-200 hover:bg-zinc-900 transition-colors"
        >
          {openNavigation ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
