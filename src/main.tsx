/* ECC THEME BUMP */
import "@/styles/theme.css";
import "@/styles/app.css";

if (import.meta.env.DEV) {
  // Load the crash overlay in dev without blocking startup
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
