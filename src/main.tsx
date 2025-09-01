import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Load ALL global styles here (and only here)
import "./styles/theme.css";
import "./styles/app.css";
import "./styles/dashboard.css";
import "./styles/table.css";
import "./styles/tokens-aliases.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
