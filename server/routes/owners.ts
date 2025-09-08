import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export const ownersRouter = Router();

// GET /api/owners/search?q=term
ownersRouter.get('/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    let query = supabaseAdmin
      .from('owners')
      .select('id, company_name, first_name, last_name, display_name')
      .order('display_name', { ascending: true })
      .limit(30);

    if (q) {
      query = query.or(
        `display_name.ilike.%${q}%,company_name.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    const owners = (data || []).map(o => ({
      id: o.id,
      label: o.display_name || [o.company_name, o.first_name, o.last_name].filter(Boolean).join(' '),
      company_name: o.company_name,
      first_name: o.first_name,
      last_name: o.last_name
    }));

    res.json({ owners });
  } catch (err:any) {
    res.status(500).json({ error: err.message || 'owners search failed' });
  }
});

// GET /api/owners/:id/summary
ownersRouter.get('/:id/summary', async (req, res) => {
  try {
    const ownerId = Number(req.params.id);

    const { data: owner, error: e1 } = await supabaseAdmin
      .from('owners')
      .select('*')
      .eq('id', ownerId)
      .single();
    if (e1) throw e1;

    const { count: propertyCount, error: e2 } = await supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', ownerId);
    if (e2) throw e2;

    res.json({ owner, counts: { properties: propertyCount || 0 }});
  } catch (err:any) {
    res.status(500).json({ error: err.message || 'owner summary failed' });
  }
});

// GET /api/owners/:id/properties?limit=200&offset=0
ownersRouter.get('/:id/properties', async (req, res) => {
  try {
    const ownerId = Number(req.params.id);
    const limit  = Math.min(Number(req.query.limit || 200), 400);
    const offset = Math.max(Number(req.query.offset || 0), 0);

    const { data, error, count } = await supabaseAdmin
      .from('properties')
      .select('id,name,city,state,units', { count: 'exact' })
      .eq('owner_id', ownerId)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    res.json({ properties: data || [], total: count || 0 });
  } catch (err:any) {
    res.status(500).json({ error: err.message || 'owner properties failed' });
  }
});