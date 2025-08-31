
import "@/styles/theme.css";
import "@/styles/app.css";
import "@/styles/_ecc-override.css";

if (import.meta.env.DEV) {
  import("@/debug/crash-overlay");
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

document.documentElement.setAttribute("data-theme", "altus");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
