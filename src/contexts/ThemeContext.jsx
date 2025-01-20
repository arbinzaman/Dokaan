import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create the ThemeModeContext
const ThemeModeContext = createContext();

// Custom hook to access theme mode
export const useThemeMode = () => useContext(ThemeModeContext);

// ThemeModeProvider component
export const ThemeModeProvider = ({ children }) => {
  // Retrieve the theme from localStorage or default to "light"
  const [mode, setMode] = useState(() =>
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);

    // Update the root element's class
    const root = document.querySelector("body"); // Change to your wrapper element if different
    if (newMode === "dark") {
        root.classList.remove("dashboard-light");
        root.classList.add("dashboard-dark");
    } else {
        root.classList.remove("dashboard-dark");
        root.classList.add("dashboard-light");
    }
};


  // Define the theme object using MUI's createTheme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#aaaaaa",
                },
              }
            : {
                background: {
                  default: "#ffffff",
                  paper: "#f5f5f5",
                },
                text: {
                  primary: "#000000",
                  secondary: "#555555",
                },
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
                  "&.Mui-focused > fieldset": {
                    borderColor: "purple",
                  },
                  "& input": {
                    color: mode === "dark" ? "white" : "black",
                  },
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
