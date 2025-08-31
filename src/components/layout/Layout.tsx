import React from "react";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecc-layout" data-ecc="layout">
      <Sidebar />
      <main className="ecc-main" data-ecc="main" role="main" style={{minHeight: "100vh"}}>
        {children}
      </main>
    </div>
  );
}
