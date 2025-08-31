/* ECC BOOTSTRAP — force theme + load overrides LAST */
import "@/styles/theme.css";
import "@/styles/app.css";
import "@/styles/_ecc-override.css"; // <- our hard override (must load last)

if (import.meta.env.DEV) {
  import("@/debug/crash-overlay");
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";

/* Ensure theme + a marker for CSS targeting */
document.documentElement.setAttribute("data-theme", "altus");
document.body.setAttribute("data-ecc", "1");

/* Tag the sidebar root at runtime so selectors always match */
document.addEventListener("DOMContentLoaded", () => {
  const sb = document.querySelector(".sidebar, [data-role='sidebar']") as HTMLElement | null;
  if (sb && !sb.hasAttribute("data-role")) sb.setAttribute("data-role", "sidebar");
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
