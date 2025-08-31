import React from "react";
import Sidebar from "@/components/Sidebar";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main style={{ height: "100vh", overflow: "auto" }}>{children}</main>
    </div>
  );
}
