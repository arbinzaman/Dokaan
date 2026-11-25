import React from "react";
import ReactDOM from "react-dom/client";
import { installDemoServer } from "./demo/mockServer.js";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeModeProvider } from "./contexts/ThemeContext.jsx";

// Boot offline demo API engine before React mounts so every feature works without a backend
installDemoServer();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <AuthProvider>
        <ThemeModeProvider>
          <App />
        </ThemeModeProvider>
        <Toaster />
      </AuthProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
