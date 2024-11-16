import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Button from "../../../landingPage/home/Button";
import MenuSvg from "../../../../assets/svg/MenuSvg";
import { useState, useEffect } from "react";
import NavList from "./NavList"; // Import NavList component

const Header = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  // Toggle the mobile navigation menu
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  // Close navigation menu when a link is clicked
  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  // Function to handle navigation to sections on the homepage
  const handleSectionNavigation = (section) => {
    handleClick(); // Close the mobile menu if it's open
    if (pathname !== "/") {
      // Navigate to the homepage with the hash
      navigate(`/#${section}`);
    } else {
      // Scroll to the section directly if already on the homepage
      const targetSection = document.querySelector(`#${section}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Scroll to the section when the hash changes
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
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block w-[12rem] xl:mr-8" to="/">
          {/* Add your logo here */}
        </Link>

        {/* Navigation Menu */}
        <NavList
          handleSectionNavigation={handleSectionNavigation}
          handleClick={handleClick}
          openNavigation={openNavigation}
        />

        {/* Desktop Buttons */}
        <Link
          to="/signup"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New account
        </Link>

        <Link to="/login" className="hidden lg:flex">
          <Button>Sign in</Button>
        </Link>

        {/* Mobile Menu Toggle Button */}
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
