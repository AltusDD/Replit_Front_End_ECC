export interface RouteEntry {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handler: string;
    status: 'active' | '410_gone' | 'alias';
    group: string;
    replacement?: string;
}

export const ROUTE_REGISTRY: RouteEntry[] = [
    // SYSTEM
    { method: 'GET', path: '/api/health', handler: 'server/index.ts', status: 'active', group: 'System' },
    { method: 'GET', path: '/api/diag/env', handler: 'server/index.ts', status: 'active', group: 'System' },
    { method: 'GET', path: '/api/_meta/routes', handler: 'server/index.ts', status: 'active', group: 'System' },
    { method: 'GET', path: '/api/config/integrations', handler: 'server/index.ts', status: 'active', group: 'Config' },

    // PORTFOLIO (CANONICAL)
    { method: 'GET', path: '/api/portfolio/properties', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },
    { method: 'GET', path: '/api/portfolio/units', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },
    { method: 'GET', path: '/api/portfolio/leases', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },
    { method: 'GET', path: '/api/portfolio/tenants', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },
    { method: 'GET', path: '/api/portfolio/owners', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },
    { method: 'GET', path: '/api/portfolio/_debug/sql', handler: 'server/index.ts', status: 'active', group: 'Portfolio' },

    // MAINTENANCE & ACCOUNTING
    { method: 'GET', path: '/api/maintenance/workorders', handler: 'server/index.ts', status: 'active', group: 'Maintenance' },
    { method: 'GET', path: '/api/accounting/transactions', handler: 'server/index.ts', status: 'active', group: 'Accounting' },

    // WORKFLOW
    { method: 'POST', path: '/api/owner-transfer/initiate', handler: 'server/index.ts', status: 'active', group: 'Workflow' },
    { method: 'POST', path: '/api/owner-transfer/approve-accounting', handler: 'server/index.ts', status: 'active', group: 'Workflow' },
    { method: 'POST', path: '/api/owner-transfer/authorize', handler: 'server/index.ts', status: 'active', group: 'Workflow' },
    { method: 'POST', path: '/api/owner-transfer/execute', handler: 'server/index.ts', status: 'active', group: 'Workflow' },
    { method: 'GET', path: '/api/owner-transfer/:id', handler: 'server/routes/ownerTransfer.ts', status: 'active', group: 'Workflow' },
    { method: 'POST', path: '/api/owner-transfer/:id/audit', handler: 'server/routes/ownerTransfer.ts', status: 'active', group: 'Workflow' },

    // GENERIC ENTITIES & RPC
    { method: 'GET', path: '/api/entities/:table/:id', handler: 'server/routes/entities.ts', status: 'active', group: 'Entities' },
    { method: 'GET', path: '/api/entities/:table', handler: 'server/routes/entities.ts', status: 'active', group: 'Entities' },
    { method: 'POST', path: '/api/rpc/:functionName', handler: 'server/routes/rpc.ts', status: 'active', group: 'RPC' },

    // ADMIN
    { method: 'GET', path: '/api/admin/sync/health', handler: 'server/routes/syncHealth.ts', status: 'active', group: 'Admin' },
    { method: 'POST', path: '/api/admin/sync/run', handler: 'server/routes/adminSync.ts', status: 'active', group: 'Admin' },
    { method: 'POST', path: '/api/admin/sync/reset-lock', handler: 'server/routes/adminSync.ts', status: 'active', group: 'Admin' },
    { method: 'POST', path: '/api/admin/sync/quick-run', handler: 'server/routes/adminSync.ts', status: 'active', group: 'Admin' },
    { method: 'POST', path: '/api/admin/integrations/m365/planner/tasks', handler: 'server/routes/m365.ts', status: 'active', group: 'Integrations' },

    // DEPRECATED / 410 GONE
    { method: 'GET', path: '/api/properties/:id', handler: 'server/routes/properties.ts', status: '410_gone', group: 'Legacy', replacement: '/api/portfolio/properties' },
    { method: 'GET', path: '/api/properties/by-doorloop/:dlId', handler: 'server/routes/properties.ts', status: '410_gone', group: 'Legacy', replacement: '/api/portfolio/properties' },
    { method: 'GET', path: '/api/owners/search', handler: 'server/routes/owners.ts', status: '410_gone', group: 'Legacy', replacement: '/api/portfolio/owners' },
    { method: 'GET', path: '/api/owners/:id/properties', handler: 'server/routes/owners.ts', status: '410_gone', group: 'Legacy', replacement: '/api/portfolio/properties' }
];

export function getRouteManifest() {
    return ROUTE_REGISTRY;
}
