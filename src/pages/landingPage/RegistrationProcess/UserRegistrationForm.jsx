import { useState } from "react";
import { TextField, IconButton, InputAdornment,  } from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const UserRegistrationForm = ({ userData, setUserData, errors }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePasswords = (password, confirm) => {
    setError(password && confirm && password !== confirm ? "Passwords do not match" : "");
  };

  return (
    <>
      {["name", "email", "password"].map((field) => (
        <TextField
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          type={field === "password" && !showPassword ? "password" : "text"}
          fullWidth
          margin="normal"
          value={userData[field]}
          onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
          error={!!errors[field]}
          helperText={errors[field]}
          InputLabelProps={{ sx: { color: "white" } }}
          InputProps={{
            sx: {
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            },
            endAdornment: field === "password" && (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <AiFillEyeInvisible size={20} color="white" /> : <AiFillEye size={20} color="white" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ))}

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          validatePasswords(userData.password, e.target.value);
        }}
        error={!!error}
        helperText={error}
        InputLabelProps={{ sx: { color: "white" } }}
        InputProps={{
          sx: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <AiFillEyeInvisible size={20} color="white" /> : <AiFillEye size={20} color="white" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default UserRegistrationForm;
