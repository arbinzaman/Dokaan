import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "white", // Label color
          },
          "& .MuiOutlinedInput-root": {
            "& > fieldset": {
              borderColor: "white", // Default border color
            },
            "&:hover > fieldset": {
              borderColor: "white", // Hover border color
            },
            "&.Mui-focused > fieldset": {
              borderColor: "purple", // Focused border color
            },
            "& input": {
              color: "white", // Input text color
            },
          },
        },
      },
    },
  },
});

export default theme;
