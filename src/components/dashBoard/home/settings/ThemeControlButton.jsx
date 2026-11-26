import { motion } from "framer-motion";
import { Check, Globe, Moon, Palette, Sun } from "lucide-react";
import {
  ACCENT_COLORS,
  DARK_PRESETS,
  useThemeMode,
} from "../../../../contexts/ThemeContext";
import { useLanguage } from "../../../../contexts/LanguageContext";

const ThemeControlButton = () => {
  const { mode, setMode, darkPreset, setDarkPreset, accent, setAccent } =
    useThemeMode();
  const { lang, setLang, isBn, pick } = useLanguage();

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Language Switch Section */}
      <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5 mb-2">
          <Globe className="w-5 h-5" style={{ color: "var(--dk-accent)" }} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {pick("App Language", "অ্যাপের ভাষা")}
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {pick(
            "Switch the entire app between English and Bangla instantly.",
            "এক ক্লিকে পুরো অ্যাপ ইংরেজি অথবা বাংলায় পরিবর্তন করুন।"
          )}
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors ${
              lang === "en"
                ? "dk-btn-accent border-transparent"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => setLang("bn")}
            className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors ${
              lang === "bn"
                ? "dk-btn-accent border-transparent"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            বাংলা (BN)
          </button>
        </div>
      </div>

      {/* Black Mode & Colour Control Section */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <Palette className="w-5 h-5" style={{ color: "var(--dk-accent)" }} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {pick("Appearance & Black Mode Colors", "থিম ও ব্ল্যাক মোড কালার")}
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {pick(
            "Choose Light or Black Mode, pick your preferred dark shade, and customize your button accent color.",
            "লাইট বা ব্ল্যাক মোড বেছে নিন, পছন্দের ডার্ক শেড ও বাটন কালার সেট করুন।"
          )}
        </p>

        {/* Light / Dark Mode */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mb-5">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors ${
              mode === "light"
                ? "dk-btn-accent border-transparent"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Sun size={16} />
            {pick("Light Mode", "লাইট মোড")}
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors ${
              mode === "dark"
                ? "dk-btn-accent border-transparent"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Moon size={16} />
            {pick("Black Mode", "ব্ল্যাক মোড")}
          </button>
        </div>

        {/* Black Mode Surface Shades */}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          {pick("Black Mode Background Shade", "ব্ল্যাক মোড ব্যাকগ্রাউন্ড শেড")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {Object.values(DARK_PRESETS).map((preset) => {
            const active = mode === "dark" && darkPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDarkPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  active
                    ? "border-[var(--dk-accent)] bg-gray-100 dark:bg-gray-800 ring-1 ring-[var(--dk-accent)]"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-6 h-6 rounded-full border border-white/25 shadow-inner"
                    style={{ backgroundColor: preset.swatch }}
                  />
                  {active && (
                    <Check
                      size={15}
                      style={{ color: "var(--dk-accent)" }}
                    />
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {isBn ? preset.bnName : preset.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Accent Color Swatches */}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          {pick("Accent Color", "বাটন ও হাইলাইট কালার")}
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.values(ACCENT_COLORS).map((item) => {
            const active = accent === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAccent(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  active
                    ? "border-[var(--dk-accent)] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.hex }}
                >
                  {active && <Check size={11} className="text-white" />}
                </span>
                <span>{isBn ? item.bnName : item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeControlButton;
