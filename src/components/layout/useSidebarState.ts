import * as React from "react";

const STORAGE_KEY = "ecc.nav.pinned";

export function useSidebarState() {
  const [pinned, setPinned] = React.useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return true; }
  });
  const togglePinned = React.useCallback(() => {
    setPinned(p => {
      try { localStorage.setItem(STORAGE_KEY, !p ? "1" : "0"); } catch {}
      return !p;
    });
  }, []);
  // collapsed = not pinned (matches contract: pin locks expanded)
  const collapsed = !pinned;
  return { pinned, collapsed, togglePinned };
}