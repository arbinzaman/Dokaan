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
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const steps = ["User Info", "Shop Info"];

const icons = {
  1: <FaUser size={20} />,
  2: <FaStore size={20} />,
};

const StepIcon = ({ icon, active, completed }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: completed ? "green" : active ? "blue" : "gray",
      color: "white",
    }}
  >
    {icon}
  </Box>
);

const RegistrationStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [shopData, setShopData] = useState({
    dokaan_name: "",
    dokaan_location: "",
    dokaan_email: "",
    dokaan_phone: "",
    dokaan_type: "",
  });
  const [errors, setErrors] = useState({});
  const { setUser, setDokaan } = useUser();
  const navigate = useNavigate();

  const validateData = () => {
    const validationErrors =
      activeStep === 0
        ? {
            name: userData.name ? "" : "Name is required",
            email: userData.email ? "" : "Email is required",
            password: userData.password ? "" : "Password is required",
          }
        : {
            dokaan_name: shopData.dokaan_name ? "" : "Shop Name is required",
            dokaan_location: shopData.dokaan_location
              ? ""
              : "Shop Location is required",
            dokaan_email: shopData.dokaan_email ? "" : "Shop Email is required",
            dokaan_phone: shopData.dokaan_phone ? "" : "Shop Phone is required",
          };

    setErrors(validationErrors);
    return Object.values(validationErrors).every((val) => !val);
  };

  const handleNext = () => {
    if (validateData()) setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const registrationData = { ...userData, ...shopData };

    toast.promise(
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/dokaan`, registrationData)
        .then(({ data }) => {
          Cookies.set("XTOKEN", data.access_token, { expires: 1, path: "/" });

          setUser(data.data.owner); // Save logged-in user
          setDokaan(data.data.dokaan); // Save shop info

          navigate("/select-shop"); // Navigate to Select Shop page
          return data;
        }),
      {
        loading: "Saving...",
        success: "Registration successful!",
        error: "Registration failed!",
      }
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "75%", md: "50%" },
          backgroundColor: "gray.700",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Registration
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <StepIcon
                    icon={icons[index + 1]}
                    active={activeStep === index}
                    completed={activeStep > index}
                  />
                )}
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationStepper;
