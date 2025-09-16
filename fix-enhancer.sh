set -e
git checkout -b fix/enhancer-inset-layout || git checkout fix/enhancer-inset-layout

############################################
# 1) CSS: centered block & subtle card look
############################################
mkdir -p src/styles
cat > src/styles/enhancer-layout.css <<'CSS'
/* Centers the enhancer content with same rhythm as main pages */
.ecc-enhancer-block {
  max-width: 1200px;
  margin: 16px auto;
  padding: 0 16px;
}
.ecc-enhancer-root-inset { width: 100%; display: block; }
.ecc-enhancer-root-fallback { position: relative; width: calc(100% - 40px); max-width: 1200px; padding-right: 16px; }

/* Keep visual consistency with dark theme */
.ecc-enhancer-block .card {
  background: #0f0f10;
  border: 1px solid #27272a;
  border-radius: 14px;
}
CSS

# Ensure it's imported once
if [ -f src/main.tsx ] && ! grep -q "styles/enhancer-layout.css" src/main.tsx; then
  sed -i '1i import "./styles/enhancer-layout.css";' src/main.tsx
fi

############################################
# 2) Apply enhanced mounting strategy
############################################

cat > src/boot/mountEnhancer.tsx <<'MOUNT'
import React from "react";
import { createRoot } from "react-dom/client";
import CardEnhancer from "../features/_enhancer/CardEnhancer";

/**
 * Mounts a secondary React root that renders CardEnhancer
 * on top of existing pages. Zero interference with your router.
 */

function pickContentRoot(): HTMLElement | null {
  // Prefer explicit markers if present
  const explicit = document.querySelector<HTMLElement>("[data-ecc-main]") || document.querySelector<HTMLElement>("#ecc-main");
  if (explicit) return explicit;
  // Common app shells
  const candidates = [
    document.querySelector<HTMLElement>("main"),
    document.querySelector<HTMLElement>(".ecc-content"),
    document.querySelector<HTMLElement>(".content"),
    document.querySelector<HTMLElement>(".page-content"),
    document.querySelector<HTMLElement>(".app-main"),
  ].filter(Boolean) as HTMLElement[];
  return candidates[0] || null;
}

function sidebarWidthPx(): number {
  const el = document.querySelector<HTMLElement>(".ecc-sidebar, aside.ecc-sidebar");
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return Math.round(r.width || 0);
}

function placeHost(host: HTMLElement) {
  const container = pickContentRoot();
  if (container) {
    host.classList.add("ecc-enhancer-root-inset");
    container.appendChild(host);
    return;
  }
  // Fallback: margin-left after sidebar
  host.classList.add("ecc-enhancer-root-fallback");
  const left = sidebarWidthPx();
  host.style.marginLeft = `${left ? left + 24 : 16}px`;
  document.body.appendChild(host);
}

function ensureMounted() {
  const id = "ecc-card-enhancer-root";
  let host = document.getElementById(id) as HTMLElement | null;
  if (!host) {
    host = document.createElement("div");
    host.id = id;
    placeHost(host);
  }
  const root = createRoot(host);
  root.render(
    <>
      <CardEnhancer />
      {typeof localStorage!=="undefined" && localStorage.getItem("ECC_DEBUG")==="1" ? (
        <div style={{position:"fixed", right:10, bottom:10, zIndex:2147483000}} className="text-[10px] text-neutral-400 bg-neutral-900/80 border border-neutral-800 rounded px-2 py-1">
          ECC Enhancer Active
        </div>
      ) : null}
    </>
  );
}

// Re-evaluate placement on navigation and resize (sidebar collapse)
function watchLayout() {
  const reflow = () => {
    const host = document.getElementById("ecc-card-enhancer-root") as HTMLElement | null;
    if (!host) return;
    const container = pickContentRoot();
    if (container && host.parentElement !== container) {
      container.appendChild(host);
      host.classList.remove("ecc-enhancer-root-fallback");
      host.classList.add("ecc-enhancer-root-inset");
    } else if (!container && host.parentElement === document.body) {
      host.classList.add("ecc-enhancer-root-fallback");
      host.style.marginLeft = `${sidebarWidthPx() + 24}px`;
    }
  };
  window.addEventListener("resize", reflow);
  window.addEventListener("popstate", ()=>{ setTimeout(reflow, 0); });
  // Sidebar collapse/expand observers (attribute/class changes)
  const sidebar = document.querySelector(".ecc-sidebar") || document.querySelector("aside.ecc-sidebar");
  if (sidebar) {
    const mo = new MutationObserver(()=> setTimeout(reflow, 0));
    mo.observe(sidebar, { attributes: true, attributeFilter: ["class", "style"] });
  }
}

(function mount(){
  ensureMounted();
  watchLayout();
})();
MOUNT

git add -A
git commit -m "fix(layout): mount enhancer inside page content; fallback margins; centered block CSS"