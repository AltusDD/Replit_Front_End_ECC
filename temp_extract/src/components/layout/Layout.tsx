import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        {children}
      </main>
    </div>
  );
}