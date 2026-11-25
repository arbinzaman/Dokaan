import { useUser } from "../../../../contexts/AuthContext";
import Button from "../../../landingPage/home/Button";
import NavList from "./NavList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import MenuSvg from "../../../../assets/Home/svg/MenuSvg";
import { useState, useEffect, useCallback } from "react";
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

  const handleClick = () => {
    if (!openNavigation) return;
    closeNavigation();
  };

  // Ensure scroll-lock is always cleaned up on unmount, route change, or desktop resize
  useEffect(() => {
    closeNavigation();
  }, [pathname, closeNavigation]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        closeNavigation();
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      enablePageScroll();
    };
  }, [closeNavigation]);

  const handleSectionNavigation = (section) => {
    handleClick();
    if (pathname !== "/") {
      navigate(`/#${section}`);
    } else {
      try {
        const targetSection = document.querySelector(`#${section}`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      } catch {
        // Ignore invalid CSS selectors
      }
    }
  };

  useEffect(() => {
    if (pathname === "/" && hash) {
      try {
        const section = document.querySelector(hash);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } catch {
        // Ignore malformed hash
      }
    }
  }, [pathname, hash]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 py-2.5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block w-[12rem] xl:mr-8" to="/" onClick={handleClick}>
          <img src={finalLogo} alt="Dokaan" className="w-10" />
        </Link>

        <NavList
          handleSectionNavigation={handleSectionNavigation}
          handleClick={handleClick}
          openNavigation={openNavigation}
        />

        {user ? (
          <Button className="hidden lg:inline-flex" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Link
              to="/signup"
              className="button hidden mr-8 text-n-1/60 transition-colors hover:text-n-1 lg:block"
            >
              New account
            </Link>
            <Button to="/login" className="hidden lg:inline-flex">
              Sign in
            </Button>
          </>
        )}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
