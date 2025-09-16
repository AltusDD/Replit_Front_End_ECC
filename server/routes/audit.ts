import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";

export function installAuditRoutes(app: Express) {
  // Get audit events with filtering
  app.get("/api/audit", async (req, res) => {
    try {
      const { 
        event_type, 
        ref_table, 
        ref_id, 
        limit = 50, 
        offset = 0,
        start_date,
        end_date 
      } = req.query;

      let query = sbAdmin
        .from("audit_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (event_type) {
        query = query.eq("event_type", event_type);
      }

      if (ref_table) {
        query = query.eq("ref_table", ref_table);
      }

      if (ref_id) {
        query = query.eq("ref_id", Number(ref_id));
      }

      if (start_date) {
        query = query.gte("created_at", start_date);
      }

      if (end_date) {
        query = query.lte("created_at", end_date);
      }

      query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

      const { data, error } = await query;
      
      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      res.json({ ok: true, events: data || [] });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e?.message || "Failed to fetch audit events" });
    }
  });

  // Get audit events for a specific entity
  app.get("/api/audit/:ref_table/:ref_id", async (req, res) => {
    try {
      const { ref_table, ref_id } = req.params;
      const { limit = 100 } = req.query;

      const { data, error } = await sbAdmin
        .from("audit_events")
        .select("*")
        .eq("ref_table", ref_table)
        .eq("ref_id", Number(ref_id))
        .order("created_at", { ascending: false })
        .limit(Number(limit));

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      res.json({ ok: true, events: data || [] });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e?.message || "Failed to fetch entity audit events" });
    }
  });

  // Get audit events by reference (query parameter format)
  app.get("/api/audit/by-ref", async (req, res) => {
    try {
      const { table, ref_id, limit = 25, offset = 0 } = req.query;

      if (!table || !ref_id) {
        return res.status(400).json({ 
          ok: false, 
          error: "Missing required query parameters: table and ref_id" 
        });
      }

      const { data, error } = await sbAdmin
        .from("audit_events")
        .select("*")
        .eq("ref_table", table)
        .eq("ref_id", Number(ref_id))
        .order("created_at", { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      res.json({ ok: true, events: data || [] });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e?.message || "Failed to fetch entity audit events" });
    }
  });

  // Get audit event summary/stats
  app.get("/api/audit/summary", async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      let query = sbAdmin
        .from("audit_events")
        .select("event_type, ref_table, created_at");

      if (start_date) {
        query = query.gte("created_at", start_date);
      }

      if (end_date) {
        query = query.lte("created_at", end_date);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      // Calculate summary stats
      const events = data || [];
      const byEventType = events.reduce((acc: any, event: any) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {});

      const byRefTable = events.reduce((acc: any, event: any) => {
        if (event.ref_table) {
          acc[event.ref_table] = (acc[event.ref_table] || 0) + 1;
        }
        return acc;
      }, {});

      res.json({ 
        ok: true, 
        summary: {
          total_events: events.length,
          by_event_type: byEventType,
          by_ref_table: byRefTable
        }
      });
    } catch (e: any) {
      res.status(400).json({ ok: false, error: e?.message || "Failed to generate audit summary" });
    }
  });
}