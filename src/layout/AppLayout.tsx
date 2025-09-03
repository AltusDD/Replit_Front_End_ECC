// src/app/AppLayout.tsx
import React, { PropsWithChildren, useEffect } from "react";

/**
 * AppLayout
 * - Keeps main content offset to the right of the sidebar.
 * - Works with the *existing* Sidebar (we don't touch it).
 * - Uses a ResizeObserver to read the actual sidebar width (72px collapsed / 280px pinned),
 *   then writes it to a CSS var so pages never render underneath the nav.
 */
export default function AppLayout({ children }: PropsWithChildren) {
  useEffect(() => {
    const root = document.documentElement;
    const sidebar =
      document.querySelector<HTMLElement>('[data-ecc="sidebar"]') ||
      document.querySelector<HTMLElement>(".sidebar") || // fallback
      undefined;

    // sensible default for first paint
    root.style.setProperty("--ecc-nav-width", "72px");

    if (!sidebar) return;

    const apply = () => {
      const px = Math.max(0, Math.floor(sidebar.getBoundingClientRect().width));
      // guard rails for weird transitions: clamp to 72/280 buckets if close
      const w = px < 120 ? 72 : px > 200 ? 280 : px;
      root.style.setProperty("--ecc-nav-width", `${w}px`);
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(sidebar);

    const onPinToggle = () => apply();
    sidebar.addEventListener("transitionend", onPinToggle);

    return () => {
      ro.disconnect();
      sidebar.removeEventListener("transitionend", onPinToggle);
    };
  }, []);

  return (
    <div className="ecc-shell">
      <main className="ecc-main" data-ecc="main">
        {children}
      </main>
    </div>
  );
}
