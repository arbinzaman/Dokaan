import { useThemeMode } from "../../../contexts/ThemeContext";

const TestComponent = () => {
  const { mode, toggleTheme } = useThemeMode();

  console.log("Current mode:", mode); // Check if the mode is logged correctly

  return (
    <button onClick={toggleTheme}>
      {mode === "dark" ? "Switch to Light 🌞" : "Switch to Dark 🌙"}
    </button>
  );
};

export default TestComponent;
