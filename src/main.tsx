import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles (single import point)
import "./styles/theme.css";
import "./styles/app.css";

// Gate eruda devtools to avoid DOMException - only load with ?eruda parameter
if (import.meta.env.DEV && location.search.includes("eruda")) {
  import("eruda")
    .then((eruda) => {
      try { eruda.default.init(); } catch {}
    })
    .catch(() => {});
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
