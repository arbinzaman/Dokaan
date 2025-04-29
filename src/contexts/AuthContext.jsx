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
    
        if (res.status === 200 && res.data?.access_token) {
          const { user: userData, dokaan: dokaanData, access_token } = res.data;
    
          setUser(userData);
          setDokaan(dokaanData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("dokaan", JSON.stringify(dokaanData));
    
          Cookies.set("XTOKEN", access_token, { expires: 1, path: "/" });
    
          return res; // ✅ success
        } else {
          throw new Error("Invalid response from server.");
        }
      } catch (error) {
        // ❌ explicitly throw to let toast.promise know this failed
        const message = error?.response?.data?.message || "Login failed!";
        throw new Error(message);
      }
    };
    
    // Logout function
    const logout = () => {
      setUser(null);
      setDokaan(null);
      localStorage.removeItem("user");
      localStorage.removeItem("dokaan");
      Cookies.remove("XTOKEN");

      toast.success("Logged out successfully!", {
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
        value={{ user, dokaan, login, logout, setUser, setDokaan }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
