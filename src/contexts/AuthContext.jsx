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
// console.log(user);
// console.log(dokaan);
  // Sync user and dokaan states with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (dokaan) {
      localStorage.setItem("dokaan", JSON.stringify(dokaan));
    } else {
      localStorage.removeItem("dokaan");
    }
  }, [dokaan]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );

      if (res.status === 200) {
        const { user: userData, dokaan: dokaanData, access_token } = res.data;

        // Save user and dokaan data to context and localStorage
        setUser(userData);
        setDokaan(dokaanData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("dokaan", JSON.stringify(dokaanData));

        // Save token in cookies for authenticated API requests
        Cookies.set("XTOKEN", access_token, { expires: 1, path: "/" });

        // toast.success("Login successful!");
        return res;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  // Logout function
  const logout = () => {
    // Clear user and dokaan data from context, localStorage, and cookies
    setUser(null);
    setDokaan(null);
    localStorage.removeItem("user");
    localStorage.removeItem("dokaan");
    Cookies.remove("XTOKEN");

    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, dokaan, login, logout, setUser, setDokaan }}>
      {children}
    </AuthContext.Provider>
  );
};
