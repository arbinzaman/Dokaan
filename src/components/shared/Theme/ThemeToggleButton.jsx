// ThemeToggleButton.jsx
import { IconButton } from "@mui/material";
import { useThemeMode } from "../../../contexts/ThemeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === "light" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
};

export default ThemeToggleButton;
