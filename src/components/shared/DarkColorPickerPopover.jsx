import { useEffect, useRef, useState } from "react";
import { Check, Moon, Palette, Sun } from "lucide-react";
import {
  ACCENT_COLORS,
  DARK_PRESETS,
  useThemeMode,
} from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";

const DarkColorPickerPopover = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { mode, setMode, darkPreset, setDarkPreset, accent, setAccent } =
    useThemeMode();
  const { isBn, pick } = useLanguage();

  useEffect(() => {
    const onOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", onOutside);
      window.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onOutside);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label={pick("Black mode & color controls", "ব্ল্যাক মোড ও কালার সেটিংস")}
        title={pick("Theme & Black Mode Colors", "থিম ও ব্ল্যাক মোড কালার")}
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
      >
        <Palette size={17} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-4 z-50 space-y-4">
          {/* Light / Dark Mode Switch */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {pick("Display Mode", "ডিসপ্লে মোড")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                  mode === "light"
                    ? "dk-btn-accent border-transparent"
                    : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Sun size={14} />
                {pick("Light", "লাইট")}
              </button>
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                  mode === "dark"
                    ? "dk-btn-accent border-transparent"
                    : "border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Moon size={14} />
                {pick("Black Mode", "ব্ল্যাক মোড")}
              </button>
            </div>
          </div>

          {/* Black Mode Surface Shades */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {pick("Black Mode Shade", "ব্ল্যাক মোড শেড")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(DARK_PRESETS).map((preset) => {
                const selected = mode === "dark" && darkPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setDarkPreset(preset.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                      selected
                        ? "border-[var(--dk-accent)] bg-slate-100 dark:bg-zinc-800 font-semibold text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: preset.swatch }}
                    />
                    <span className="truncate">
                      {isBn ? preset.bnName : preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Control */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
              {pick("Accent Color", "অ্যাকসেন্ট কালার")}
            </p>
            <div className="flex items-center justify-between gap-2">
              {Object.values(ACCENT_COLORS).map((item) => {
                const active = accent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAccent(item.id)}
                    title={isBn ? item.bnName : item.name}
                    aria-label={isBn ? item.bnName : item.name}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                      active ? "scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-white" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: item.hex }}
                  >
                    {active && <Check size={15} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkColorPickerPopover;
