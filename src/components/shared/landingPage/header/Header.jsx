import { useUser } from "../../../../contexts/AuthContext"; // Adjust the import path
import Button from "../../../landingPage/home/Button";
import NavList from "./NavList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import MenuSvg from "../../../../assets/Home/svg/MenuSvg";
import { useState, useEffect } from "react";
import finalLogo from "../../../../assets/Home/logos/DOKAAN Only D.png";

const Header = () => {
  const { user, logout } = useUser();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleSectionNavigation = (section) => {
    handleClick();
    if (pathname !== "/") {
      navigate(`/#${section}`);
    } else {
      const targetSection = document.querySelector(`#${section}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (pathname === "/" && hash) {
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname, hash]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 p-2 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block w-[12rem] xl:mr-8" to="/">
          {/* Add your logo here */}
          <img
            src={finalLogo}
            alt="Dokaan"
            className="w-10"
          />
        </Link>

        <NavList
          handleSectionNavigation={handleSectionNavigation}
          handleClick={handleClick}
          openNavigation={openNavigation}
        />

        {user ? (
          <Button className="hidden lg:block" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Link
              to="/signup"
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              New account
            </Link>
            <Link to="/login" className="hidden lg:flex">
              <Button>Sign in</Button>
            </Link>
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
    </div>
  );
};

export default Header;
