import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.toggle("dark", mode === "dark");

    if (mode === "dark") {
      body.classList.remove("dashboard-light");
      body.classList.add("dashboard-dark");
    } else {
      body.classList.remove("dashboard-dark");
      body.classList.add("dashboard-light");
    }
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: { default: "#121212", paper: "#1e1e1e" },
                text: { primary: "#ffffff", secondary: "#aaaaaa" },
              }
            : {
                background: { default: "#ffffff", paper: "#f5f5f5" },
                text: { primary: "#000000", secondary: "#555555" },
              }),
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiInputLabel-root": {
                  color: mode === "dark" ? "white" : "black",
                },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": {
                    borderColor: mode === "dark" ? "white" : "black",
                  },
                  "&:hover > fieldset": {
                    borderColor: mode === "dark" ? "white" : "black",
                  },
                  "&.Mui-focused > fieldset": { borderColor: "purple" },
                  "& input": { color: mode === "dark" ? "white" : "black" },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
