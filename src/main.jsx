import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@emotion/react";
import theme from "./contexts/ThemeContext.jsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
  <React.StrictMode>
    <AuthProvider>
     <ThemeProvider theme={theme}>
      <App />
      </ThemeProvider>
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
  </QueryClientProvider>
);
