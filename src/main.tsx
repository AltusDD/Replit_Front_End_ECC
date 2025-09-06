import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles (single import point)
import "./styles/theme.css";
import "./styles/app.css";
import "./styles/Dashboard.css";

// Remove eruda import to avoid dev build errors and DOMExceptions.
// If needed locally, devs can paste the CDN snippet in the browser console.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
