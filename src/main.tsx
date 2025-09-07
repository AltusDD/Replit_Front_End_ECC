import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./styles/app.css";

/**
 * Replit sometimes injects eruda devtools; when it does, it can throw benign
 * DOMExceptions that clutter the console. Filter those without hiding real errors.
 */
(function silenceErudaNoise() {
  const isEruda = (e: any) =>
    typeof e?.filename === "string" && e.filename.includes("/eruda/");
  window.addEventListener(
    "error",
    (ev) => {
      if (isEruda(ev)) ev.stopImmediatePropagation();
    },
    true
  );
  window.addEventListener(
    "unhandledrejection",
    (ev: any) => {
      const m = String(ev?.reason?.stack || ev?.reason || "");
      if (m.includes("/eruda/")) ev.stopImmediatePropagation();
    },
    true
  );
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
