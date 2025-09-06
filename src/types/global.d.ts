// src/types/global.d.ts
export {};

declare global {
  interface Window {
    eruda?: { init: () => void };
  }
}