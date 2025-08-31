import React from "react";
import Sidebar from "../Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecc-layout">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
