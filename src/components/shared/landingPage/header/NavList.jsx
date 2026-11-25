import { Link } from "react-router-dom";
import { HamburgerMenu } from "../../../landingPage/home/design/Header";
import { useUser } from "../../../../contexts/AuthContext";

const NavList = ({ handleSectionNavigation, handleClick, openNavigation }) => {
  const { user, logout } = useUser();

  return (
    <nav
      className={`${
        openNavigation ? "flex" : "hidden"
      } fixed top-[4.5rem] left-0 right-0 bottom-0 bg-n-8 overflow-y-auto lg:overflow-visible lg:static lg:flex lg:mx-auto lg:bg-transparent`}
    >
      <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
        <button
          type="button"
          onClick={() => handleSectionNavigation("features")}
          className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Features
        </button>
        <button
          type="button"
          onClick={() => handleSectionNavigation("pricing")}
          className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Pricing
        </button>
        <a
          href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="text-emerald-400 hover:text-emerald-300 transition-colors font-code text-2xl uppercase px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
        >
          Download Mobile App
        </a>

        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={handleClick}
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                handleClick();
                logout();
              }}
              className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 lg:hidden px-6 py-6 md:py-8 lg:text-xs lg:font-semibold"
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
    </nav>
  );
};

export default NavList;
