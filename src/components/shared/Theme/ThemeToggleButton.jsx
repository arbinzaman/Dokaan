import { Button } from "@mui/material";
import { useThemeMode } from "../../../contexts/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Button
      onClick={toggleTheme}
      variant="outlined"
      sx={{
        textTransform: "none",
        borderColor: mode === "light" ? "#ddd" : "#555",
        color: mode === "light" ? "#333" : "#fff",
        backgroundColor: mode === "light" ? "#fff" : "#333",
        "&:hover": {
          backgroundColor: mode === "light" ? "#f9f9f9" : "#444",
          borderColor: mode === "light" ? "#ccc" : "#666",
        },
      }}
    >
      {mode === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};

export default ThemeToggleButton;















// import { IconButton, Tooltip } from "@mui/material";
// import { DarkMode, LightMode } from "@mui/icons-material";
// import { useThemeMode } from "../../../contexts/ThemeContext";
// import { motion } from "framer-motion";

// const ThemeToggleButton = () => {
//   const { mode, toggleTheme } = useThemeMode();

//   return (
//     <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
//       <motion.div
//         whileHover={{ scale: 1.2, rotate: 20 }}
//         whileTap={{ scale: 0.9, rotate: -20 }}
//       >
//         <IconButton
//           onClick={toggleTheme}
//           color="inherit"
//           sx={{
//             backgroundColor: mode === "light" ? "#f4f4f4" : "#333",
//             color: mode === "light" ? "#333" : "#f4f4f4",
//             transition: "all 0.3s ease",
//             "&:hover": {
//               backgroundColor: mode === "light" ? "#e0e0e0" : "#444",
//             },
//           }}
//         >
//           {mode === "light" ? <DarkMode fontSize="medium" /> : <LightMode fontSize="medium" />}
//         </IconButton>
//       </motion.div>
//     </Tooltip>
//   );
// };

// export default ThemeToggleButton;
