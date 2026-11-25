import { useState } from "react";
import { Check, Loader2, Store, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ShopInfoForm from "./ShopInfoForm";
import UserRegistrationForm from "./UserRegistrationForm";
import { useUser } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import dokaanIcon from "../../../assets/Home/logos/DOKAAN Only D.png";

const STEPS = [
  { id: 0, label: "Account Details", icon: User },
  { id: 1, label: "Shop Details", icon: Store },
];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      handleNext();
      return;
    }
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
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900/80 border border-zinc-800 p-7 sm:p-9 shadow-2xl">
        <div className="text-center mb-6">
          <img
            src={dokaanIcon}
            alt="Dokaan"
            className="w-10 h-10 mx-auto mb-3 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create your Dokaan account
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Set up your owner profile and first shop in 2 quick steps
          </p>
        </div>

        {/* Clean Minimalist Stepper */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = activeStep > step.id;
            const isCurrent = activeStep === step.id;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-colors ${
                  isCurrent
                    ? "border-indigo-500/70 bg-indigo-500/10 text-white"
                    : isCompleted
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-800 bg-zinc-950/50 text-zinc-500"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-emerald-500 text-zinc-950"
                      : isCurrent
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {isCompleted ? <Check size={13} /> : <Icon size={13} />}
                </span>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              disabled={activeStep === 0 || isSubmitting}
              onClick={() => setActiveStep(0)}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-60 font-semibold text-sm transition-colors inline-flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {activeStep === 0
                ? "Continue to Shop Info"
                : isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </div>
        </form>

        <p className="text-center text-zinc-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationStepper;
