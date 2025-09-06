import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles (single import point)
import "./styles/theme.css";
import "./styles/app.css";
import "./styles/Dashboard.css";

/**
 * Dev-only, opt-in mobile console:
 * Load Eruda from CDN only when URL includes ?eruda.
 * No bundler import => Vite won't try to resolve a package.
 */
if (import.meta.env.DEV && window.location.search.includes("eruda")) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/eruda@3.2.3/eruda.min.js";
  script.async = true;
  script.onload = () => {
    // @ts-expect-error (eruda is injected on window)
    if (window.eruda && typeof window.eruda.init === "function") {
      // @ts-expect-error
      window.eruda.init();
    }
  };
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
