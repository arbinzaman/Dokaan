/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

export const useUser = () => useContext(AuthContext);

const safeParseStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParseStorage("user"));
  const [dokaan, setDokaan] = useState(() => safeParseStorage("dokaan"));
  const [savedShop, setSavedShop] = useState(() => safeParseStorage("savedShop"));
  const [loading] = useState(false);

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

  useEffect(() => {
    if (savedShop) {
      localStorage.setItem("savedShop", JSON.stringify(savedShop));
    } else {
      localStorage.removeItem("savedShop");
    }
  }, [savedShop]);

  // Clear stale session silently if cookie expired without hijacking public routes
  useEffect(() => {
    const token = Cookies.get("XTOKEN");
    if (!token && user) {
      setUser(null);
      setDokaan(null);
      setSavedShop(null);
      localStorage.removeItem("user");
      localStorage.removeItem("dokaan");
      localStorage.removeItem("savedShop");
    }
  }, [user]);

  // Synchronously persist selected shop to avoid race conditions before navigation/reload
  const selectShop = useCallback((shop) => {
    setSavedShop(shop);
    if (shop) {
      localStorage.setItem("savedShop", JSON.stringify(shop));
    } else {
      localStorage.removeItem("savedShop");
    }
  }, []);

  // Keep user.twoFactorEnabled in sync after toggling 2FA
  const updateTwoFactor = useCallback((enabled) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, twoFactorEnabled: Boolean(enabled) };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Keep dokaan list and savedShop in sync after editing a shop
  const updateShop = useCallback((updatedShop) => {
    if (!updatedShop) return;
    setDokaan((prev) => {
      const list = Array.isArray(prev) ? prev : prev ? [prev] : [];
      const next = list.map((shop) =>
        shop?.id === updatedShop.id ? { ...shop, ...updatedShop } : shop
      );
      localStorage.setItem("dokaan", JSON.stringify(next));
      return next;
    });
    setSavedShop((prev) => {
      if (prev?.id === updatedShop.id) {
        const next = { ...prev, ...updatedShop };
        localStorage.setItem("savedShop", JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, []);

  // Keep dokaan list in sync after adding a shop
  const addShop = useCallback((newShop) => {
    if (!newShop) return;
    setDokaan((prev) => {
      const list = Array.isArray(prev) ? prev : prev ? [prev] : [];
      const next = [...list, newShop];
      localStorage.setItem("dokaan", JSON.stringify(next));
      return next;
    });
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (!cleanEmail.endsWith("@dokaan.demo")) {
        localStorage.removeItem("dokaan_demo_mode");
        const existingToken = Cookies.get("XTOKEN") || "";
        if (existingToken.startsWith("demo-token-")) {
          Cookies.remove("XTOKEN", { path: "/" });
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );

      if (res.status === 200 && res.data?.access_token) {
        const { user: userData, dokaan: dokaanData, access_token } = res.data;
        const normalizedDokaans = Array.isArray(dokaanData)
          ? dokaanData
          : dokaanData
          ? [dokaanData]
          : [];

        setUser(userData);
        setDokaan(normalizedDokaans);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("dokaan", JSON.stringify(normalizedDokaans));
        Cookies.set("XTOKEN", access_token, { expires: 1, path: "/" });

        // Automatically select the shop for employees or single-shop owners
        if (
          (userData?.role === "employee" || normalizedDokaans.length === 1) &&
          normalizedDokaans[0]
        ) {
          selectShop(normalizedDokaans[0]);
        }

        return res;
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed!";
      throw new Error(message);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setDokaan(null);
    setSavedShop(null);

    localStorage.removeItem("user");
    localStorage.removeItem("dokaan");
    localStorage.removeItem("savedShop");
    localStorage.removeItem("dokaan_demo_mode");
    Cookies.remove("XTOKEN", { path: "/" });

    toast.success("Logged out!");

    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }, 300);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        dokaan,
        loading,
        login,
        logout,
        setUser,
        setDokaan,
        savedShop,
        setSavedShop: selectShop,
        selectShop,
        updateTwoFactor,
        updateShop,
        addShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
