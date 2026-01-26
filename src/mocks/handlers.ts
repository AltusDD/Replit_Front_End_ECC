import { http, HttpResponse } from "msw";

let PROPS = [
  { id:"p1", name:"Pinecrest Apts", address:"123 Main St", city:"Austin", state:"TX", zip:"78701",
    ownerName:"Altus Investments LLC", units:42, occupancyPct:98.3, avgRentCents:145000, status:"Stabilized",
    active:true, delinquencyCents: 23000, openWorkorders: 1 },
  { id:"p2", name:"Magnolia Court", address:"14111 Magnolia St", city:"Hammond", state:"IN", zip:"46320",
    ownerName:"Magnolia Holdings", units:1, occupancyPct:100, avgRentCents:255000, status:"Leased",
    active:true, delinquencyCents: 0, openWorkorders: 0 },
  { id:"p3", name:"Maple Flats", address:"77 Maple Ave", city:"Gary", state:"IN", zip:"46402",
    ownerName:"Altus Investments LLC", units:12, occupancyPct:91.5, avgRentCents:95000, status:"Value-Add",
    active:false, delinquencyCents: 88000, openWorkorders: 2 },
  { id:"p4", name:"Harbor View", address:"2 Lake Dr", city:"Whiting", state:"IN", zip:"46394",
    ownerName:"Pinecrest Partners LP", units:28, occupancyPct:95.2, avgRentCents:125000, status:"Lease-Up",
    active:true, delinquencyCents: 15000, openWorkorders: 1 },
];

let OWNERS = [
  { id:"o1", displayName:"Altus Investments LLC" },
  { id:"o2", displayName:"Pinecrest Partners LP" },
  { id:"o3", displayName:"Magnolia Holdings" },
];

export const handlers = [
  // LIST with includeInactive + power query (very light)
  http.get("/api/portfolio/properties", ({ request }) => {
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get("includeInactive") === "1";
    const q = (url.searchParams.get("q") || "").toLowerCase();

    let list = includeInactive ? PROPS : PROPS.filter(p => p.active);

    // power query: owner:, status:, wo:, delinquency: with quote support
    if (q) {
      // Enhanced parsing to handle quoted values like owner:"Altus Holdings"
      const tokens = [];
      let current = "";
      let inQuotes = false;
      let quoteChar = "";
      
      for (let i = 0; i < q.length; i++) {
        const char = q[i];
        if (!inQuotes && (char === '"' || char === "'")) {
          inQuotes = true;
          quoteChar = char;
          current += char;
        } else if (inQuotes && char === quoteChar) {
          inQuotes = false;
          current += char;
        } else if (!inQuotes && /\s/.test(char)) {
          if (current.trim()) {
            tokens.push(current.trim());
            current = "";
          }
        } else {
          current += char;
        }
      }
      if (current.trim()) tokens.push(current.trim());

      for (const token of tokens) {
        if (token.startsWith("owner:")) {
          let v = token.slice(6);
          // Strip surrounding quotes if present
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          list = list.filter(p => (p.ownerName||"").toLowerCase().includes(v.toLowerCase()));
        } else if (token.startsWith("status:")) {
          let v = token.slice(7);
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          list = list.filter(p => (p.status||"").toLowerCase().includes(v.toLowerCase()));
        } else if (token.startsWith("wo:")) {
          const v = Number(token.slice(3));
          list = list.filter(p => (p.openWorkorders||0) >= v);
        } else if (token.startsWith("delinquency:")) {
          const v = Number(token.slice(12));
          list = list.filter(p => (p.delinquencyCents||0) >= v*100);
        } else {
          // generic contains - also strip quotes for generic search
          let searchTerm = token;
          if ((searchTerm.startsWith('"') && searchTerm.endsWith('"')) || (searchTerm.startsWith("'") && searchTerm.endsWith("'"))) {
            searchTerm = searchTerm.slice(1, -1);
          }
          list = list.filter(p =>
            [p.name,p.address,p.city,p.state,p.zip,p.ownerName].some(x => (x||"").toLowerCase().includes(searchTerm.toLowerCase())));
        }
      }
    }
    return HttpResponse.json(list);
  }),
  http.get("/api/owners", () => HttpResponse.json(OWNERS)),
  http.post("/api/owners", async ({ request }) => {
    const body:any = await request.json();
    const id = `o${OWNERS.length+1}`;
    const rec = { id, displayName: body.displayName || body.name || `Owner ${id}` };
    OWNERS.push(rec);
    return HttpResponse.json(rec, { status: 201 });
  }),
  http.post("/api/properties", async ({ request }) => {
    const b:any = await request.json();
    const id = `p${PROPS.length+1}`;
    const rec = {
      id,
      name: b.name, address: b.address || "", city: b.city, state: b.state, zip: b.zip || "",
      ownerName: b.ownerName || "Unknown Owner",
      units: b.units ?? 0, occupancyPct: 0, avgRentCents: Math.round((b.avgRent ?? 0) * 100),
      status: b.status ?? "Active", active: true, ownerId: b.ownerId,
      delinquencyCents: 0, openWorkorders: 0
    };
    PROPS.unshift(rec);
    return HttpResponse.json(rec, { status: 201 });
  }),
  http.post("/api/properties/:id/units", async ({ params, request }) => {
    const body:any = await request.json();
    const p = PROPS.find(x=>x.id===params.id);
    if (p) p.units = (p.units||0) + (Array.isArray(body?.units) ? body.units.length : 0);
    return HttpResponse.json({ ok:true }, { status: 201 });
  }),
  http.post("/api/properties/:id/lease-with-tenant", async () => HttpResponse.json({ ok:true }, { status: 201 })),
];