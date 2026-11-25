import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const darkInputSx = {
  "& .MuiInputLabel-root": { color: "#ADA8C3" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#AC6AFF" },
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    "& fieldset": { borderColor: "#3F3A52" },
    "&:hover fieldset": { borderColor: "#757185" },
    "&.Mui-focused fieldset": { borderColor: "#AC6AFF" },
    "& input": { color: "#ffffff" },
  },
};

const UserRegistrationForm = ({ userData, setUserData, errors = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mismatchError =
    userData.confirmPassword && userData.password !== userData.confirmPassword
      ? "Passwords do not match"
      : "";

  return (
    <>
      <TextField
        label="Name"
        type="text"
        fullWidth
        margin="normal"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        error={!!errors.name}
        helperText={errors.name}
        sx={darkInputSx}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
        sx={darkInputSx}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        error={!!errors.password}
        helperText={errors.password}
        sx={darkInputSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} color="#CAC6DD" />
                ) : (
                  <AiFillEye size={20} color="#CAC6DD" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={userData.confirmPassword || ""}
        onChange={(e) =>
          setUserData({ ...userData, confirmPassword: e.target.value })
        }
        error={!!(errors.confirmPassword || mismatchError)}
        helperText={errors.confirmPassword || mismatchError}
        sx={darkInputSx}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={20} color="#CAC6DD" />
                ) : (
                  <AiFillEye size={20} color="#CAC6DD" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default UserRegistrationForm;
