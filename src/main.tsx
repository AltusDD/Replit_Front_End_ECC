// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";

// FIX: Import theme first, then app styles. No more duplicates.
import "./styles/theme.css";
import "./styles/app.css";

import App from "./App";

// This is a good way to scope themes if you ever add more than one.
document.documentElement.setAttribute("data-theme", "altus");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);