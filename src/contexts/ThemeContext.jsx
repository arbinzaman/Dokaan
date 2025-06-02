import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(mode);

    const body = document.body;
    body.classList.remove("dashboard-light", "dashboard-dark");
    body.classList.add(mode === "dark" ? "dashboard-dark" : "dashboard-light");
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
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === "dark" ? "#121212" : "#ffffff",
                color: mode === "dark" ? "#ffffff" : "#000000",
              },
            },
          },
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
