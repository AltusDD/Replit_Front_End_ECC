// server/routes/admin/integrations.ts
import { Router, Request, Response } from "express";
import { dlGet, dlHealthCheck, getCircuitBreakerState, resetCircuitBreaker } from "../../clients/doorloop";
import { sbAdmin } from "../../lib/supabaseAdmin";

export const integrations = Router();

function isAuthorized(req: Request) {
  const token = req.headers['x-admin-token'] || req.headers['authorization']?.replace('Bearer ', '');
  return token && token === process.env.ADMIN_SYNC_TOKEN;
}

// Enhanced ping endpoint with rate limits and circuit breaker info
integrations.get("/doorloop/ping", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const healthResult = await dlHealthCheck();
    const circuitState = getCircuitBreakerState();
    
    res.json({
      ...healthResult,
      circuitBreaker: {
        isOpen: circuitState.isOpen,
        failures: circuitState.failures,
        lastFailure: circuitState.lastFailure,
        cooldownMs: circuitState.cooldownMs,
      }
    });
  } catch (e: any) {
    res.status(502).json({
      ok: false,
      authenticated: false,
      error: String(e).slice(0, 500),
      elapsedMs: 0,
      circuitBreaker: getCircuitBreakerState(),
    });
  }
});

// Check specific DoorLoop endpoint with custom params  
integrations.get("/doorloop/check", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const endpoint = req.query.endpoint as string || "owners";
  const pageSize = Math.min(10, Number(req.query.page_size) || 1);
  
  const t0 = Date.now();
  try {
    const r = await dlGet<any>(`/${endpoint}`, { page_size: pageSize });
    const items = Array.isArray(r) ? r : (r?.data || []);
    const firstItem = items[0];
    
    res.json({
      ok: true,
      endpoint,
      count: items.length,
      sampleKeys: firstItem ? Object.keys(firstItem) : [],
      elapsedMs: Date.now() - t0,
    });
  } catch (e: any) {
    const error = String(e);
    const is404 = error.includes("HTTP 404");
    const is401 = error.includes("HTTP 401");
    
    res.status(is404 ? 404 : is401 ? 401 : 502).json({
      ok: false,
      endpoint,
      error: error.slice(0, 300),
      elapsedMs: Date.now() - t0,
      hint: is404 ? `Endpoint /${endpoint} not found` : 
            is401 ? "Authentication failed" :
            "API connection failed"
    });
  }
});

// Circuit breaker controls
integrations.post("/doorloop/circuit-breaker/reset", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  resetCircuitBreaker();
  res.json({ ok: true, message: "Circuit breaker reset" });
});

// Get admin config (to check if admin token is available)
integrations.get("/config", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  res.json({
    ok: true,
    hasAdminToken: !!process.env.ADMIN_SYNC_TOKEN,
    adminEndpoints: [
      '/api/admin/sync/run',
      '/api/admin/sync/reset-lock', 
      '/api/admin/sync/quick-run',
      '/api/admin/integrations/doorloop/ping'
    ]
  });
});

// Teams webhook test endpoint
integrations.post("/teams/test", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const webhookUrl = process.env.INTEGRATIONS_TEAMS_WEBHOOK;
  if (!webhookUrl) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Teams webhook not configured. Set INTEGRATIONS_TEAMS_WEBHOOK environment variable.' 
    });
  }

  const { message = "🧪 Test message from ECC Genesis System - Teams integration is working!" } = req.body;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ 
        text: message,
        title: "ECC Teams Integration Test",
        summary: "Test message from ECC Genesis"
      }),
    });

    if (!response.ok) {
      throw new Error(`Teams webhook responded with ${response.status}: ${response.statusText}`);
    }

    res.json({ 
      ok: true, 
      message: 'Test message sent successfully',
      timestamp: new Date().toISOString(),
      webhookConfigured: true
    });
  } catch (error: any) {
    console.error('[teams] Test webhook failed:', error);
    res.status(500).json({ 
      ok: false, 
      error: `Failed to send test message: ${error.message}`,
      webhookConfigured: true
    });
  }
});

// Get recent sync runs from audit events
integrations.get("/sync/runs", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const limit = Math.min(50, Number(req.query.limit) || 20);
    
    const { data: auditEvents } = await sbAdmin
      .from('audit_events')
      .select('*')
      .in('event_type', ['AUTO_SYNC', 'MANUAL_SYNC'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!auditEvents) {
      return res.json({ ok: true, runs: [] });
    }

    // Transform audit events into sync run format
    const runs = auditEvents.map(event => ({
      id: event.id?.toString() || Math.random().toString(),
      timestamp: event.created_at,
      entity: event.payload?.entity || 'unknown',
      mode: event.payload?.mode === 'backfill' ? 'backfill' as const : 'delta' as const,
      rows: event.payload?.rows || 0,
      duration: event.payload?.duration || 0,
      result: event.payload?.error ? 'error' as const : 'success' as const,
      error: event.payload?.error || undefined,
      fullMessage: event.payload?.fullError || undefined,
      fullDetails: event.payload || undefined
    }));

    res.json({ ok: true, runs });
  } catch (error) {
    console.error('[integrations] Error fetching sync runs:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch sync runs' });
  }
});