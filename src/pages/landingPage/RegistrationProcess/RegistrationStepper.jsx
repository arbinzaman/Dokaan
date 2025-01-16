import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box, Typography } from "@mui/material";
import { FaUser, FaStore } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import ShopInfoForm from "./ShopInfoForm";
import UserRegistrationForm from "./UserRegistrationForm";
import { useUser } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"


const steps = ["User Info", "Shop Info"];

const icons = {
  1: <FaUser size={20} />,
  2: <FaStore size={20} />,
};

// Custom Step Icon Component
const StepIcon = ({ icon, active, completed }) => {
  return (
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
};

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
  const { setUser, setDokaan } = useUser(); // Access setUser and setDokaan from context

  // Validation for user data
  const validateUserData = () => {
    const errors = {};
    if (!userData.name) errors.name = "Name is required";
    if (!userData.email) errors.email = "Email is required";
    if (!userData.password) errors.password = "Password is required";
    return errors;
  };

  // Validation for shop data
  const validateShopData = () => {
    const errors = {};
    if (!shopData.dokaan_name) errors.dokaan_name = "Shop Name is required";
    if (!shopData.dokaan_location) errors.dokaan_location = "Shop Location is required";
    if (!shopData.dokaan_email) errors.dokaan_email = "Shop Email is required";
    if (!shopData.dokaan_phone) errors.dokaan_phone = "Shop Phone is required";
    return errors;
  };

  const navigate = useNavigate()
  const handleNext = () => {
    if (activeStep === 0) {
      const validationErrors = validateUserData();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
    } else if (activeStep === 1) {
      const validationErrors = validateShopData();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    const { name, email, password } = userData;
    const { dokaan_name, dokaan_location, dokaan_email, dokaan_phone, dokaan_type } = shopData;

    const registrationData = {
      name,
      email,
      password,
      dokaan_name,
      dokaan_location,
      dokaan_email,
      dokaan_phone,
      dokaan_type,
    };

    toast.promise(
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/dokaan`, registrationData)
        .then((response) => {
          const { owner, dokaan } = response.data.data; // Extract user and dokaan data from response
            console.log(response);
            console.log(owner);
            console.log(dokaan);
            Cookies.set("XTOKEN", response.data.access_token, { expires: 1, path: "/" });
            if(response.status===200){
                navigate("/dashboard")
            }
          // Update context with both user and dokaan
          setUser(owner);
          setDokaan(dokaan);

          return response;
        }),
      {
        loading: "Saving registration details...",
        success: "Registration successful!",
        error: "Registration failed. Please try again.",
      }
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <UserRegistrationForm userData={userData} setUserData={setUserData} errors={errors} />;
      case 1:
        return <ShopInfoForm shopData={shopData} setShopData={setShopData} />;
      default:
        return "Unknown Step";
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
        p: 3,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "75%", md: "50%" },
          backgroundColor: "blueGrey.700",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Registration Process
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
          {renderStepContent(activeStep)}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
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
