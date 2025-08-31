import React from "react";
import Sidebar from "@/components/Sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      {/* Sidebar renders its own <aside> container */}
      <Sidebar />

      {/* Main content column scrolls independently */}
      <div className="content">
        {children}
      </div>
    </div>
  );
}
