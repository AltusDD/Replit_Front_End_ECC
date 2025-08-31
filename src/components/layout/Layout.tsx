import React from "react";
import Sidebar from "@/components/Sidebar";
export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="layout">
      <Sidebar/>
      <main className="main">{children}</main>
    </div>
  );
}
