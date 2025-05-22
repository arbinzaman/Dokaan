/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

export const useUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [dokaan, setDokaan] = useState(() => {
    const storedDokaan = localStorage.getItem("dokaan");
    return storedDokaan ? JSON.parse(storedDokaan) : null;
  });

  const [savedShop, setSavedShop] = useState(() => {
    const storedShop = localStorage.getItem("savedShop");
    return storedShop ? JSON.parse(storedShop) : null;
  });

  // Sync user and dokaan states with localStorage
  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    dokaan
      ? localStorage.setItem("dokaan", JSON.stringify(dokaan))
      : localStorage.removeItem("dokaan");
  }, [dokaan]);

  useEffect(() => {
    savedShop
      ? localStorage.setItem("savedShop", JSON.stringify(savedShop))
      : localStorage.removeItem("savedShop");
  }, [savedShop]);

  // Logout if token is missing
  useEffect(() => {
    const token = Cookies.get("XTOKEN");
    if (!token && user) {
      logout();
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );

      if (res.status === 200 && res.data?.access_token) {
        const { user: userData, dokaan: dokaanData, access_token } = res.data;

        setUser(userData);
        setDokaan(dokaanData);
        Cookies.set("XTOKEN", access_token, { expires: 1, path: "/" });

        return res;
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed!";
      throw new Error(message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setDokaan(null);
    setSavedShop(null);

    localStorage.removeItem("user");
    localStorage.removeItem("dokaan");
    localStorage.removeItem("savedShop");
    Cookies.remove("XTOKEN");

    toast.success("Logged out!", {
      style: {
        border: "1px solid #713200",
        padding: "16px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dokaan,
        login,
        logout,
        setUser,
        setDokaan,
        savedShop,
        setSavedShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
