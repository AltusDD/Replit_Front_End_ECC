import React from "react";
import ReactDOM from "react-dom/client";

console.log("[ECC] probe loaded");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div style={{padding:24,color:"#d1fae5",fontFamily:"system-ui"}}>
    <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>ECC Probe OK</div>
    <div>Vite is serving modules and React mounted.</div>
  </div>
);