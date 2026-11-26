/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useContext, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

export const DARK_PRESETS = {
  obsidian: {
    id: "obsidian",
    name: "Obsidian Dark",
    bnName: "অবসিডিয়ান ডার্ক",
    bg: "#09090b",
    surface: "#141417",
    elevated: "#1e1e23",
    border: "#27272a",
    swatch: "#18181b",
  },
  oled: {
    id: "oled",
    name: "Pure OLED Black",
    bnName: "পিওর ব্ল্যাক (OLED)",
    bg: "#000000",
    surface: "#0a0a0c",
    elevated: "#141418",
    border: "#1f1f24",
    swatch: "#000000",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Navy",
    bnName: "মিডনাইট নেভি",
    bg: "#0b1120",
    surface: "#111a2e",
    elevated: "#1a2640",
    border: "#243352",
    swatch: "#0f172a",
  },
  crimson: {
    id: "crimson",
    name: "Dokaan Crimson Dark",
    bnName: "দোকান ক্রিমসন ডার্ক",
    bg: "#0c0607",
    surface: "#160b0d",
    elevated: "#221114",
    border: "#3b181f",
    swatch: "#260b10",
  },
};

export const ACCENT_COLORS = {
  red: {
    id: "red",
    name: "Dokaan Red",
    bnName: "দোকান লাল",
    hex: "#DC2626",
    hover: "#B91C1C",
    soft: "rgba(220, 38, 38, 0.14)",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Green",
    bnName: "সবুজ",
    hex: "#059669",
    hover: "#047857",
    soft: "rgba(5, 150, 105, 0.14)",
  },
  blue: {
    id: "blue",
    name: "Ocean Blue",
    bnName: "নীল",
    hex: "#2563EB",
    hover: "#1D4ED8",
    soft: "rgba(37, 99, 235, 0.14)",
  },
  indigo: {
    id: "indigo",
    name: "Royal Indigo",
    bnName: "ইন্ডিগো",
    hex: "#4F46E5",
    hover: "#4338CA",
    soft: "rgba(79, 70, 229, 0.14)",
  },
  amber: {
    id: "amber",
    name: "Warm Amber",
    bnName: "সোনালি",
    hex: "#D97706",
    hover: "#B45309",
    soft: "rgba(217, 119, 6, 0.14)",
  },
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setModeState] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [darkPreset, setDarkPresetState] = useState(() => {
    const saved = localStorage.getItem("dokaan_dark_preset");
    return saved && DARK_PRESETS[saved] ? saved : "obsidian";
  });
  const [accent, setAccentState] = useState(() => {
    const saved = localStorage.getItem("dokaan_accent");
    return saved && ACCENT_COLORS[saved] ? saved : "red";
  });

  useEffect(() => {
    const html = document.documentElement;
    const presetObj = DARK_PRESETS[darkPreset] || DARK_PRESETS.obsidian;
    const accentObj = ACCENT_COLORS[accent] || ACCENT_COLORS.red;

    html.classList.remove("dark", "light");
    html.classList.add(mode);
    html.style.colorScheme = mode;
    html.setAttribute("data-dark-preset", presetObj.id);
    html.setAttribute("data-accent", accentObj.id);

    html.style.setProperty("--dk-bg", mode === "dark" ? presetObj.bg : "#f8fafc");
    html.style.setProperty("--dk-surface", mode === "dark" ? presetObj.surface : "#ffffff");
    html.style.setProperty("--dk-elevated", mode === "dark" ? presetObj.elevated : "#f1f5f9");
    html.style.setProperty("--dk-border", mode === "dark" ? presetObj.border : "#e2e8f0");
    html.style.setProperty("--dk-accent", accentObj.hex);
    html.style.setProperty("--dk-accent-hover", accentObj.hover);
    html.style.setProperty("--dk-accent-soft", accentObj.soft);

    const body = document.body;
    body.classList.remove("dashboard-light", "dashboard-dark");
    body.classList.add(mode === "dark" ? "dashboard-dark" : "dashboard-light");
  }, [mode, darkPreset, accent]);

  const setMode = useCallback((nextMode) => {
    const valid = nextMode === "light" ? "light" : "dark";
    setModeState(valid);
    localStorage.setItem("theme", valid);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const setDarkPreset = useCallback((presetId) => {
    if (!DARK_PRESETS[presetId]) return;
    setDarkPresetState(presetId);
    localStorage.setItem("dokaan_dark_preset", presetId);
    // Switch to dark mode automatically so user immediately sees their selected black color
    setModeState("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const setAccent = useCallback((accentId) => {
    if (!ACCENT_COLORS[accentId]) return;
    setAccentState(accentId);
    localStorage.setItem("dokaan_accent", accentId);
  }, []);

  const theme = useMemo(() => {
    const presetObj = DARK_PRESETS[darkPreset] || DARK_PRESETS.obsidian;
    const accentObj = ACCENT_COLORS[accent] || ACCENT_COLORS.red;
    return createTheme({
      palette: {
        mode,
        primary: { main: accentObj.hex },
        ...(mode === "dark"
          ? {
              background: { default: presetObj.bg, paper: presetObj.surface },
              text: { primary: "#ffffff", secondary: "#a1a1aa" },
            }
          : {
              background: { default: "#f8fafc", paper: "#ffffff" },
              text: { primary: "#0f172a", secondary: "#475569" },
            }),
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: mode === "dark" ? presetObj.bg : "#f8fafc",
              color: mode === "dark" ? "#f4f4f5" : "#0f172a",
            },
          },
        },
      },
    });
  }, [mode, darkPreset, accent]);

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        setMode,
        toggleTheme,
        darkPreset,
        setDarkPreset,
        accent,
        setAccent,
        accentColor: ACCENT_COLORS[accent] || ACCENT_COLORS.red,
        darkPresetConfig: DARK_PRESETS[darkPreset] || DARK_PRESETS.obsidian,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
