import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./styles/theme.css";
import "./styles/Dashboard.css";
import "./styles/app.css";

if (import.meta.env.DEV) {
  // React StrictMode + aborted fetches during HMR
  window.addEventListener("unhandledrejection", (e: any) => {
    if (e?.reason?.name === "AbortError") e.preventDefault();
  });
  window.addEventListener("error", (e: any) => {
    if (String(e?.message || "").includes("AbortError")) e.preventDefault();
  });

  // If Replit injects eruda and it misbehaves, try to kill it silently
  const erudaAny = (window as any).eruda;
  if (erudaAny && typeof erudaAny.destroy === "function") {
    try { erudaAny.destroy(); } catch {}
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
