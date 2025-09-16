// server/bff.js
import express from "express";

const app = express();
app.use(express.json());

const BASE = (process.env.API_BASE_URL || "").replace(/\/$/, "");
const ADMIN = process.env.ADMIN_SYNC_TOKEN || "";
const EXPECTED_REFERER = process.env.EXPECTED_REFERER || "";
const BFF_AUTH_TOKEN = process.env.BFF_AUTH_TOKEN || "";

// Security middleware: Validate origin and authentication
function validateRequest(req, res, next) {
  // Check if required config is present
  if (!BASE || !ADMIN) {
    return res.status(503).json({ 
      error: "BFF not properly configured. Missing API_BASE_URL or ADMIN_SYNC_TOKEN" 
    });
  }

  // Method 1: Check referer header (basic origin validation)
  const referer = req.get('referer') || req.get('origin') || "";
  if (EXPECTED_REFERER && !referer.startsWith(EXPECTED_REFERER)) {
    console.warn(`[BFF Security] Blocked request from unauthorized origin: ${referer}`);
    return res.status(403).json({ error: "Forbidden: Invalid origin" });
  }

  // Method 2: Check for auth token if configured
  if (BFF_AUTH_TOKEN) {
    const authHeader = req.get('authorization');
    const providedToken = authHeader?.replace('Bearer ', '') || "";
    if (providedToken !== BFF_AUTH_TOKEN) {
      console.warn(`[BFF Security] Blocked request with invalid auth token`);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  }

  // Method 3: Basic rate limiting (simple in-memory)
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;
  
  if (!global.bffRateLimit) global.bffRateLimit = {};
  if (!global.bffRateLimit[clientIP]) global.bffRateLimit[clientIP] = [];
  
  // Clean old entries
  global.bffRateLimit[clientIP] = global.bffRateLimit[clientIP].filter(timestamp => now - timestamp < windowMs);
  
  if (global.bffRateLimit[clientIP].length >= maxRequests) {
    console.warn(`[BFF Security] Rate limited IP: ${clientIP}`);
    return res.status(429).json({ error: "Too many requests" });
  }
  
  global.bffRateLimit[clientIP].push(now);
  
  next();
}

function forward(step) {
  return async (req, res) => {
    try {
      console.log(`[BFF] Forwarding ${step} request to ${BASE}/api/owners/${step}`);
      
      const r = await fetch(`${BASE}/api/owners/${step}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": ADMIN,          // token never leaves the server
        },
        body: JSON.stringify(req.body || {}),
      });
      const text = await r.text();
      res.status(r.status);
      // try to keep content-type from the upstream
      const ct = r.headers.get("content-type") || "application/json";
      res.setHeader("content-type", ct);
      res.send(text);
    } catch (e) {
      console.error(`[BFF Error] ${step}:`, e);
      res.status(500).json({ error: String(e) });
    }
  };
}

// Apply security middleware to all BFF routes
app.use("/bff", validateRequest);

// Secured BFF endpoints
app.post("/bff/owners/approvetransfer",   forward("approvetransfer"));
app.post("/bff/owners/authorizetransfer", forward("authorizetransfer"));
app.post("/bff/owners/executetransfer",   forward("executetransfer"));

// Health check for BFF status
app.get("/bff/health", (req, res) => {
  const isConfigured = !!(BASE && ADMIN);
  res.json({
    configured: isConfigured,
    hasRefererCheck: !!EXPECTED_REFERER,
    hasAuthToken: !!BFF_AUTH_TOKEN,
    baseUrl: BASE ? "***configured***" : null
  });
});

export default app;