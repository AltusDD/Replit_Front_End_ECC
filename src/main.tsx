import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./styles/theme.css";
import "./styles/Dashboard.css";
import "./styles/app.css";

// Eruda debugging code removed to eliminate DOMException errors

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
