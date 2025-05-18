import { Link } from "react-router-dom";
import { HamburgerMenu } from "../../../landingPage/home/design/Header";
import { useUser } from "../../../../contexts/AuthContext"; // Adjust the import path

const NavList = ({ handleSectionNavigation, handleClick, openNavigation }) => {
  const { user, logout } = useUser();

  return (
    <div
      className={`${
        openNavigation ? "flex" : "hidden"
      } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
    >
      <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
        <button
          onClick={() => handleSectionNavigation("features")}
          className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Features
        </button>
        <button
          onClick={() => handleSectionNavigation("pricing")}
          className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Pricing
        </button>
        <a
          href="https://drive.google.com/uc?export=download&id=1W7OdlyNAttLTKkahlglO-wTeuDgyKUNO"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#39ff14] drop-shadow-[0_0_5px_#39ff14] font-code text-2xl uppercase px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Download App
        </a>

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                logout();
                handleClick();
              }}
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              onClick={handleClick}
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 lg:hidden px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
            >
              New account
            </Link>
            <Link
              to="/login"
              onClick={handleClick}
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 lg:hidden px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
      <HamburgerMenu />
    </div>
  );
};

export default NavList;
