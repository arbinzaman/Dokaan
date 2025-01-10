import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

export const useUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // // Get user data from localStorage on page load
    // const storedUser = localStorage.getItem("user");
    // return storedUser ? JSON.parse(storedUser) : null;
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
        const userData = res.data;

        // Save user data to context and localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Save token in cookies for authenticated API requests
        Cookies.set("XTOKEN", userData.access_token, { expires: 1, path: "/" });

        return 200;
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // console.log("Restoring user from localStorage:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
