/**
 * Centralized API base resolver.
 * - Reads VITE_API_BASE if set, else defaults to '/api'
 * - Supports Azure Functions endpoints
 */
export function getApiBase() {
  const env = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  const base = env?.VITE_API_BASE || "/api";
  return String(base).replace(/\/+$/, ""); // trim trailing slash
}

/**
 * Get admin token for authenticated operations
 * Checks environment variables first, then localStorage fallback
 * 
 * ⚠️  SECURITY WARNING: This function falls back to localStorage for admin tokens.
 * This is a development convenience but poses security risks in production environments.
 * Admin tokens should be properly secured and not stored in browser localStorage.
 * Consider using proper authentication flows with secure token storage.
 */
export function getAdminToken(): string | null {
  const env = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  let token = env?.VITE_ADMIN_TOKEN;
  
  // Fallback to localStorage for admin token (as mentioned in Azure script)
  // WARNING: This exposes admin tokens in browser storage - use only for development
  if (!token && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('ADMIN_SYNC_TOKEN');
  }
  
  return token || null;
}

/**
 * Check if using Azure Functions backend
 */
export function isAzureFunctions(): boolean {
  const base = getApiBase();
  return base.includes('azurewebsites.net');
}
