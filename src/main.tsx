/* ECC BOOTSTRAP */
import "@/styles/theme.css";
import "@/styles/app.css";
import "@/styles/_ecc-override.css"; // must be last


import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

document.documentElement.setAttribute("data-theme", "altus");
document.body.setAttribute("data-ecc", "1");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
