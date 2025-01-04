/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const useUser = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(user);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );


      if (res.status === 200) {
        localStorage.setItem(
          "access_token",
          JSON.stringify({
            username: res?.data?.username,
            email: res?.data?.email,
            role: res?.data?.role,
          })
        );
        Cookies.set("access_token", res.data.token, { expires: 1 });
        setUser(JSON.parse(localStorage.getItem("access_token")));
        return 200;
      }
    } catch (error) {
      // console.log(error)
      // console.error("Login failed:", error.message);
      toast.error(`${error.response.data.message}`);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("access_token");
      Cookies.remove("access_token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(JSON.parse(localStorage.getItem("access_token")));
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
