// src/boot/mountEnhancer.tsx
import { ReactNode } from "react";

/** Minimal no-op enhancer so main.tsx can import it safely. */
export default function mountEnhancer(node: ReactNode) {
  return node;
}

// Also export a named variant in case main.tsx uses this symbol.
export function withMountEnhancer(node: ReactNode) {
  return node;
}