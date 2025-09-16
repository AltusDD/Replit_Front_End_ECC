// server/clients/doorloop.ts
import qs from "querystring";

const BASE = process.env.DOORLOOP_BASE_URL || "https://app.doorloop.com/api";
const API_KEY = process.env.DOORLOOP_API_KEY || "";

if (!API_KEY) {
  console.warn("[doorloop] Missing DOORLOOP_API_KEY");
}

type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, any>;
  body?: any;
  timeoutMs?: number;
  skipCircuitBreaker?: boolean;
};

export type RateLimit = {
  limit?: number;
  remaining?: number;
  reset?: number;
};

export type DoorLoopResponse<T> = {
  data: T;
  rateLimit?: RateLimit;
  status: number;
  elapsedMs: number;
};

// Circuit breaker state
let circuitBreakerState = {
  isOpen: false,
  failures: 0,
  lastFailure: 0,
  cooldownMs: 60000, // 60 seconds cooldown
};

const MAX_FAILURES = 5;

function parseRateLimit(headers: Headers): RateLimit | undefined {
  const limit = headers.get("x-ratelimit-limit") || headers.get("ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining") || headers.get("ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset") || headers.get("ratelimit-reset");
  
  if (!limit && !remaining && !reset) return undefined;
  
  return {
    limit: limit ? Number(limit) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
    reset: reset ? Number(reset) : undefined,
  };
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 4xx errors (except 429)
      if (error instanceof Error && error.message.includes("HTTP 4")) {
        const isRateLimit = error.message.includes("HTTP 429");
        if (!isRateLimit) throw error;
      }
      
      if (attempt === maxRetries) break;
      
      // Exponential backoff with jitter
      const delay = baseDelayMs * Math.pow(1.8, attempt);
      const jitter = Math.random() * 0.1 * delay;
      await sleep(delay + jitter);
    }
  }
  
  throw lastError!;
}

export async function dlFetch<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { method = "GET", query, body, timeoutMs = 20000, skipCircuitBreaker = false } = opts;

  // Check circuit breaker
  if (!skipCircuitBreaker && circuitBreakerState.isOpen) {
    const now = Date.now();
    if (now - circuitBreakerState.lastFailure < circuitBreakerState.cooldownMs) {
      throw new Error(`[doorloop] Circuit breaker is open. Cooldown until ${new Date(circuitBreakerState.lastFailure + circuitBreakerState.cooldownMs)}`);
    } else {
      // Reset circuit breaker after cooldown
      circuitBreakerState.isOpen = false;
      circuitBreakerState.failures = 0;
    }
  }

  const startTime = Date.now();
  
  const makeFetch = async (): Promise<DoorLoopResponse<T>> => {
    const u = new URL(path.replace(/^\//, ""), BASE);
    if (query) u.search = qs.stringify(Object.fromEntries(
      Object.entries(query).filter(([,v]) => v !== undefined && v !== null)
    ));

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    const res = await fetch(u.toString(), {
      method,
      headers: {
        "Authorization": `bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    }).catch((e) => {
      clearTimeout(t);
      throw new Error(`[doorloop] fetch failed ${u.toString()}: ${e}`);
    });

    clearTimeout(t);
    const elapsedMs = Date.now() - startTime;

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      
      // Track failures for circuit breaker
      if (res.status >= 500) {
        circuitBreakerState.failures++;
        circuitBreakerState.lastFailure = Date.now();
        
        if (circuitBreakerState.failures >= MAX_FAILURES) {
          circuitBreakerState.isOpen = true;
        }
      }
      
      throw new Error(`[doorloop] HTTP ${res.status} for ${u.toString()} :: ${text.slice(0,300)}`);
    }

    // Reset failure count on success
    circuitBreakerState.failures = 0;
    
    const data = await res.json() as T;
    const rateLimit = parseRateLimit(res.headers);

    return {
      data,
      rateLimit,
      status: res.status,
      elapsedMs,
    };
  };

  const response = await retry(makeFetch);
  return response.data;
}

// Enhanced fetch that returns full response info
export async function dlFetchFull<T = any>(path: string, opts: FetchOpts = {}): Promise<DoorLoopResponse<T>> {
  const { method = "GET", query, body, timeoutMs = 20000, skipCircuitBreaker = false } = opts;

  // Check circuit breaker
  if (!skipCircuitBreaker && circuitBreakerState.isOpen) {
    const now = Date.now();
    if (now - circuitBreakerState.lastFailure < circuitBreakerState.cooldownMs) {
      throw new Error(`[doorloop] Circuit breaker is open. Cooldown until ${new Date(circuitBreakerState.lastFailure + circuitBreakerState.cooldownMs)}`);
    } else {
      // Reset circuit breaker after cooldown
      circuitBreakerState.isOpen = false;
      circuitBreakerState.failures = 0;
    }
  }

  const startTime = Date.now();
  
  const makeFetch = async (): Promise<DoorLoopResponse<T>> => {
    const u = new URL(path.replace(/^\//, ""), BASE);
    if (query) u.search = qs.stringify(Object.fromEntries(
      Object.entries(query).filter(([,v]) => v !== undefined && v !== null)
    ));

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    const res = await fetch(u.toString(), {
      method,
      headers: {
        "Authorization": `bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    }).catch((e) => {
      clearTimeout(t);
      throw new Error(`[doorloop] fetch failed ${u.toString()}: ${e}`);
    });

    clearTimeout(t);
    const elapsedMs = Date.now() - startTime;

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      
      // Track failures for circuit breaker
      if (res.status >= 500) {
        circuitBreakerState.failures++;
        circuitBreakerState.lastFailure = Date.now();
        
        if (circuitBreakerState.failures >= MAX_FAILURES) {
          circuitBreakerState.isOpen = true;
        }
      }
      
      throw new Error(`[doorloop] HTTP ${res.status} for ${u.toString()} :: ${text.slice(0,300)}`);
    }

    // Reset failure count on success
    circuitBreakerState.failures = 0;
    
    const data = await res.json() as T;
    const rateLimit = parseRateLimit(res.headers);

    return {
      data,
      rateLimit,
      status: res.status,
      elapsedMs,
    };
  };

  return retry(makeFetch);
}

// Circuit breaker controls
export function getCircuitBreakerState() {
  return { ...circuitBreakerState };
}

export function resetCircuitBreaker() {
  circuitBreakerState.isOpen = false;
  circuitBreakerState.failures = 0;
  circuitBreakerState.lastFailure = 0;
}

// Convenience helpers
export const dlGet  = <T=any>(p: string, q?: Record<string, any>) => dlFetch<T>(p, { method: "GET",  query: q });
export const dlPost = <T=any>(p: string, body?: any)               => dlFetch<T>(p, { method: "POST", body });

// Enhanced helpers that return full response info
export const dlGetFull = <T=any>(p: string, q?: Record<string, any>) => dlFetchFull<T>(p, { method: "GET", query: q });
export const dlPostFull = <T=any>(p: string, body?: any) => dlFetchFull<T>(p, { method: "POST", body });

// Pagination helper for DoorLoop API with progress callback
export async function dlPaginate<T>(
  path: string,
  params: Record<string, any> = {},
  pageSize = 200,
  onProgress?: (page: number, items: number, rateLimit?: RateLimit) => void
): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  
  while (true) {
    const response = await dlFetchFull<any>(path, { 
      method: "GET",
      query: {
        ...params, 
        page_number: page, 
        page_size: pageSize 
      }
    });
    
    const batch: T[] = Array.isArray(response.data) ? response.data : (response.data.data || []);
    out.push(...batch);
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress(page, batch.length, response.rateLimit);
    }
    
    const hasMore = Array.isArray(response.data) 
      ? batch.length === pageSize
      : (response.data?.meta?.nextPage ?? (batch.length === pageSize));
      
    if (!hasMore) break;
    page += 1;
    
    // Be polite to the API - respect rate limits
    const delay = response.rateLimit?.remaining && response.rateLimit.remaining < 10 ? 1000 : 250;
    await new Promise(r => setTimeout(r, delay));
  }
  
  return out;
}

// Health check function for ping endpoint
export async function dlHealthCheck(): Promise<{
  ok: boolean;
  baseUrl: string;
  authenticated: boolean;
  sampleCount?: number;
  elapsedMs: number;
  rateLimit?: RateLimit;
  error?: string;
}> {
  try {
    const response = await dlFetchFull("/owners", { 
      method: "GET", 
      query: { page_size: 1 },
      skipCircuitBreaker: true 
    });
    
    const sampleCount = Array.isArray(response.data) 
      ? response.data.length 
      : (response.data.data?.length || 0);
    
    return {
      ok: true,
      baseUrl: BASE,
      authenticated: true,
      sampleCount,
      elapsedMs: response.elapsedMs,
      rateLimit: response.rateLimit,
    };
  } catch (error) {
    const isAuthError = error instanceof Error && (
      error.message.includes("HTTP 401") || 
      error.message.includes("HTTP 403")
    );
    
    return {
      ok: false,
      baseUrl: BASE,
      authenticated: !isAuthError,
      elapsedMs: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}