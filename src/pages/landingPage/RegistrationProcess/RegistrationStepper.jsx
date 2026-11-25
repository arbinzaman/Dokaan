import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { FaUser, FaStore } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import ShopInfoForm from "./ShopInfoForm";
import UserRegistrationForm from "./UserRegistrationForm";
import { useUser } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const steps = ["User Info", "Shop Info"];

const stepIcons = {
  1: <FaUser size={18} />,
  2: <FaStore size={18} />,
};

const CustomStepIcon = ({ active, completed, icon }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 38,
      height: 38,
      borderRadius: "50%",
      backgroundColor: completed ? "#10b981" : active ? "#6366f1" : "#3f3f46",
      color: "white",
    }}
  >
    {stepIcons[String(icon)]}
  </Box>
);

const RegistrationStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [shopData, setShopData] = useState({
    dokaan_name: "",
    dokaan_location: "",
    dokaan_email: "",
    dokaan_phone: "",
    dokaan_type: "",
  });
  const [errors, setErrors] = useState({});
  const { setUser, setDokaan, selectShop } = useUser();
  const navigate = useNavigate();

  const validateStep = (step) => {
    const validationErrors =
      step === 0
        ? {
            name: userData.name.trim() ? "" : "Name is required",
            email: !userData.email.trim()
              ? "Email is required"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())
              ? "Enter a valid email address"
              : "",
            password:
              userData.password.length >= 6
                ? ""
                : "Password must be at least 6 characters",
            confirmPassword: !userData.confirmPassword
              ? "Please confirm your password"
              : userData.password !== userData.confirmPassword
              ? "Passwords do not match"
              : "",
          }
        : {
            dokaan_name: shopData.dokaan_name.trim()
              ? ""
              : "Shop Name is required",
            dokaan_location: shopData.dokaan_location.trim()
              ? ""
              : "Shop Location is required",
            dokaan_email: !shopData.dokaan_email.trim()
              ? "Shop Email is required"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopData.dokaan_email.trim())
              ? "Enter a valid shop email"
              : "",
            dokaan_phone: shopData.dokaan_phone.trim()
              ? ""
              : "Shop Phone is required",
          };

    setErrors(validationErrors);
    return Object.values(validationErrors).every((val) => !val);
  };

  const handleNext = () => {
    if (validateStep(0)) {
      setErrors({});
      setActiveStep(1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateStep(1)) return;

    const registrationData = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      ...shopData,
    };

    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/dokaan`,
        registrationData
      );

      if (data?.access_token) {
        Cookies.set("XTOKEN", data.access_token, { expires: 1, path: "/" });
      }

      const owner = data?.data?.owner || data?.user;
      const createdDokaan = data?.data?.dokaan || data?.dokaan;
      const dokaanList = Array.isArray(createdDokaan)
        ? createdDokaan
        : createdDokaan
        ? [createdDokaan]
        : [];

      if (owner) setUser(owner);
      if (dokaanList.length > 0) {
        setDokaan(dokaanList);
        if (dokaanList.length === 1) {
          selectShop(dokaanList[0]);
        }
      }

      toast.success("Registration successful!", { id: toastId });
      navigate(dokaanList.length > 1 ? "/select-shop" : "/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        pt: 12,
        pb: 6,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "85%", md: "520px" },
          backgroundColor: "#15131D",
          border: "1px solid #252134",
          borderRadius: 3,
          boxShadow: 6,
          p: { xs: 3, sm: 4 },
          color: "#ffffff",
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Create Your Dokaan Account
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={CustomStepIcon}
                sx={{
                  "& .MuiStepLabel-label": { color: "#ADA8C3" },
                  "& .MuiStepLabel-label.Mui-active": { color: "#ffffff" },
                  "& .MuiStepLabel-label.Mui-completed": { color: "#10b981" },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {activeStep === 0 ? (
            <UserRegistrationForm
              userData={userData}
              setUserData={setUserData}
              errors={errors}
            />
          ) : (
            <ShopInfoForm
              shopData={shopData}
              setShopData={setShopData}
              errors={errors}
            />
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0 || isSubmitting}
              onClick={() => setActiveStep((prev) => prev - 1)}
              sx={{ color: "#CAC6DD" }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
          <p className="text-center text-n-3 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-color-1 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationStepper;
