import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ErrorBoundary from '@/components/ErrorBoundary';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // Track sidebar collapsed state for layout adjustments
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("ecc:sidebar:collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Listen for changes to sidebar state
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const collapsed = localStorage.getItem("ecc:sidebar:collapsed") === "true";
        setSidebarCollapsed(collapsed);
      } catch {}
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Also listen for direct localStorage changes in same tab
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app-shell">
      {/* Sidebar renders its own <aside> container */}
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      {/* Main content column adjusts based on sidebar state */}
      <div className={`content layout-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}