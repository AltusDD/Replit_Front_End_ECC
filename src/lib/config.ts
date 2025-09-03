/**
 * Centralized API base resolver.
 * - Reads VITE_API_BASE if set, else defaults to '/api'
 */
export function getApiBase() {
  const env = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  const base = env?.VITE_API_BASE || "/api";
  return String(base).replace(/\/+$/, ""); // trim trailing slash
}
