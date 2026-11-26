import { useLanguage } from "../../contexts/LanguageContext";

const LanguageToggle = ({ variant = "dashboard", className = "" }) => {
  const { lang, setLang } = useLanguage();

  const isLanding = variant === "landing";

  return (
    <div
      role="group"
      aria-label="Language switch"
      className={`inline-flex items-center rounded-xl p-0.5 text-xs font-semibold border transition-colors ${
        isLanding
          ? "bg-zinc-950/80 border-red-950/80"
          : "bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-lg transition-colors ${
          lang === "en"
            ? isLanding
              ? "bg-red-600 text-white"
              : "dk-btn-accent shadow-xs"
            : isLanding
            ? "text-zinc-400 hover:text-white"
            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        className={`px-2.5 py-1 rounded-lg transition-colors ${
          lang === "bn"
            ? isLanding
              ? "bg-red-600 text-white"
              : "dk-btn-accent shadow-xs"
            : isLanding
            ? "text-zinc-400 hover:text-white"
            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageToggle;
