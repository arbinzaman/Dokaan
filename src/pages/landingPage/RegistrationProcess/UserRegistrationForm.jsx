import { useState } from "react";
import { TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const UserRegistrationForm = ({ userData, setUserData }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUserData({ ...userData, password });
    validatePasswords(password, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirm = e.target.value;
    setConfirmPassword(confirm);
    validatePasswords(userData.password, confirm);
  };

  const validatePasswords = (password, confirm) => {
    if (password && confirm && password !== confirm) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  return (
    <>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={userData.password}
        onChange={handlePasswordChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <AiFillEyeInvisible size={20} color="white" /> : <AiFillEye size={20} color="white" />}
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
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                {showConfirmPassword ? <AiFillEyeInvisible size={20} color="white" /> : <AiFillEye size={20} color="white"  />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default UserRegistrationForm;
