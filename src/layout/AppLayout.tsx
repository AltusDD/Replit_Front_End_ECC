import React, { useLayoutEffect, useState } from "react";
import "@/styles/layout.css";

/**
 * AppLayout wraps all page content.
 * It dynamically measures the Sidebar and offsets the main area,
 * so pages never render underneath the nav (collapsed or expanded).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(280); // default expanded

  useLayoutEffect(() => {
    const sidebarEl =
      document.querySelector("[data-sidebar-root]") ||
      document.getElementById("ecc-sidebar") ||
      document.querySelector(".ecc-sidebar");

    if (!sidebarEl) return;

    const update = () => {
      const rect = (sidebarEl as HTMLElement).getBoundingClientRect();
      // collapsed fallback ≈72px, expanded ≈280px
      const width = rect.width || (sidebarEl.classList.contains("collapsed") ? 72 : 280);
      setSidebarWidth(width);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(sidebarEl);

    return () => ro.disconnect();
  }, []);

  return (
    <div className="ecc-app">
      <main className="ecc-main" style={{ paddingLeft: `${sidebarWidth}px` }}>
        <div className="ecc-main-inner">{children}</div>
      </main>
    </div>
  );
}
