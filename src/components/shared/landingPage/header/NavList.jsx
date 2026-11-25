import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useUser } from "../../../../contexts/AuthContext";

const NavList = ({ handleSectionNavigation, handleClick, openNavigation }) => {
  const { user, logout } = useUser();

  return (
    <nav
      className={`${
        openNavigation ? "flex" : "hidden"
      } fixed top-16 left-0 right-0 bottom-0 bg-zinc-950/98 backdrop-blur-xl overflow-y-auto lg:overflow-visible lg:static lg:flex lg:bg-transparent flex-col lg:flex-row items-center justify-center gap-2 lg:gap-7 p-6 lg:p-0`}
    >
      <button
        type="button"
        onClick={() => handleSectionNavigation("features")}
        className="text-lg lg:text-sm font-medium text-zinc-300 hover:text-white transition-colors py-3 lg:py-1"
      >
        Features
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("workflow")}
        className="text-lg lg:text-sm font-medium text-zinc-300 hover:text-white transition-colors py-3 lg:py-1"
      >
        How It Works
      </button>
      <button
        type="button"
        onClick={() => handleSectionNavigation("pricing")}
        className="text-lg lg:text-sm font-medium text-zinc-300 hover:text-white transition-colors py-3 lg:py-1"
      >
        Pricing
      </button>
      <a
        href="https://drive.google.com/file/d/1UwUeq3zu8N2VvGk59ReNgPiowpCvMKS9/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-lg lg:text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors py-3 lg:py-1"
      >
        <Download size={15} />
        Android App
      </a>

      {/* Mobile-only Auth Links */}
      <div className="flex flex-col items-center gap-3 mt-6 pt-6 border-t border-zinc-800 w-full max-w-xs lg:hidden">
        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={handleClick}
              className="w-full text-center py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm"
            >
              Open Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                handleClick();
                logout();
              }}
              className="w-full text-center py-2.5 rounded-xl border border-zinc-800 text-zinc-200 font-medium text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              onClick={handleClick}
              className="w-full text-center py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              onClick={handleClick}
              className="w-full text-center py-2.5 rounded-xl border border-zinc-800 text-zinc-200 font-medium text-sm"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavList;
