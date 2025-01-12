import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

export const useUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user data from localStorage on page load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // When the user changes, update localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );

      if (res.status === 200) {
        const userData = res.data.user;

        // Save user data to context and localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Save token in cookies for authenticated API requests
        Cookies.set("XTOKEN", res.data.access_token, { expires: 1, path: "/" });

        return res;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const logout = () => {
    // Clear user data from context, localStorage, and cookies
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("XTOKEN");
  };

  const updateTwoFactor = (newTwoFactorStatus) => {
    // Update the twoFactorEnabled field in the user state
    const updatedUser = { ...user, twoFactorEnabled: newTwoFactorStatus };
    
    // Update the context with the new user data
    setUser(updatedUser);

    // Update localStorage as well
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateTwoFactor }}>
      {children}
    </AuthContext.Provider>
  );
};


