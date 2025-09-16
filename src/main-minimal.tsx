import React from "react";
import ReactDOM from "react-dom/client";

// Minimal test - just render "Hello React"
function MinimalApp() {
  return <div style={{padding: '20px', color: 'white'}}>Hello React - Minimal Test Working!</div>;
}

const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    console.log("Creating React root...");
    const root = ReactDOM.createRoot(rootElement);
    console.log("Rendering minimal app...");
    root.render(<MinimalApp />);
    console.log("React mounted successfully!");
  } catch (error) {
    console.error("React mount failed:", error);
    rootElement.innerHTML = `<div style="padding:24px;color:red;">React mount failed: ${error}</div>`;
  }
} else {
  console.error("Root element not found!");
}