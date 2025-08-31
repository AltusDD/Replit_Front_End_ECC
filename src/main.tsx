
import "./styles/theme.css";
import "./styles/app.css"; // Only these two CSS files should be imported as per the style checking script

if (import.meta.env.DEV) {
  import("./debug/crash-overlay"); // keep dev overlay if present
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

document.documentElement.setAttribute("data-theme", "altus");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

