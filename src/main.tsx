import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles (single import point)
import "./styles/theme.css";
import "./styles/app.css";

if (import.meta.env.DEV) {
  import("@/mocks/browser").then(({ worker }) =>
    worker.start({ 
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js"
      }
    })
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
