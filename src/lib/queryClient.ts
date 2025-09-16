import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      placeholderData: (prev) => prev,
      throwOnError: false,
      networkMode: "online",
    },
  },
});

// AbortError filtering is handled in main.tsx via global event listeners
// and in fetchJSON via never-resolving promise returns

/**
 * Generic API request helper for mutations
 */
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}