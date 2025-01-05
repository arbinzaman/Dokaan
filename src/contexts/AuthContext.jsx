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
    console.log(email, password);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", res.data);
      console.log(res);

      if (res.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: res?.data?.username,
            email: res?.data?.email,
            role: res?.data?.role,
          })
        );
        Cookies.set("access_token", res.data.token, { expires: 1 });
        setUser(JSON.parse(localStorage.getItem("user")));
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
      localStorage.removeItem("user");
      Cookies.remove("access_token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
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
