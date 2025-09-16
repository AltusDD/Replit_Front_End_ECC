// Ultra-minimal debug version with aggressive error catching
console.log("DEBUG: Script starting...");

try {
  console.log("DEBUG: Attempting React import...");
  import("react").then(React => {
    console.log("DEBUG: React imported:", React);
    
    return import("react-dom/client");
  }).then(ReactDOMClient => {
    console.log("DEBUG: ReactDOM imported:", ReactDOMClient);
    
    const rootElement = document.getElementById("root");
    console.log("DEBUG: Root element found:", rootElement);
    
    if (rootElement) {
      const root = ReactDOMClient.createRoot(rootElement);
      console.log("DEBUG: React root created:", root);
      
      root.render("SUCCESS: React is working!");
      console.log("DEBUG: React render successful!");
    } else {
      throw new Error("Root element not found");
    }
  }).catch(error => {
    console.error("DEBUG: Import/mount failed:", error);
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `<div style="padding:24px;color:red;background:black;font-family:monospace;">
        <div style="font-weight:bold;">REACT DEBUG ERROR:</div>
        <div style="margin-top:8px;">${String(error)}</div>
        <div style="margin-top:8px;">Check console for details</div>
      </div>`;
    }
  });
} catch (syncError) {
  console.error("DEBUG: Synchronous error:", syncError);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `<div style="padding:24px;color:red;">SYNC ERROR: ${syncError}</div>`;
  }
}