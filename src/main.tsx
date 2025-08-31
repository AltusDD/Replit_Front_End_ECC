/* ECC BOOTSTRAP — STABLE BASELINE */
import "@/styles/theme.css";
import "@/styles/app.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";

document.documentElement.setAttribute("data-theme", "altus");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
