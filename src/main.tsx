import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "./components/ui/toaster";
import AuthProvider from "./hooks/useAuth.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster />
      </AuthProvider>
        </ThemeProvider>
    </>
  </React.StrictMode>
);
