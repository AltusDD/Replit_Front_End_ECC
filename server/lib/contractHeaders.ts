import { Request, Response } from 'express';
import { ROUTE_REGISTRY } from './routeRegistry.js';

export function setContract(req: Request, res: Response, canonicalPath: string) {
    // If the request came through an alias, its originalUrl won't match the canonicalPath.
    // Try to find if this is a requested alias:
    const basePath = req.originalUrl?.split('?')[0] || canonicalPath;
    let entry = ROUTE_REGISTRY.find(r => r.path === basePath);

    // Fallback to canonical entry if base path has dynamic parameters or wasn't found directly
    if (!entry) {
        entry = ROUTE_REGISTRY.find(r => r.path === canonicalPath);
    }

    if (!entry) return;

    res.setHeader('x-ecc-handler', entry.handler);

    if (entry.status !== '410_gone') {
        res.setHeader('x-ecc-contract', entry.contract_name || 'UNKNOWN');
        res.setHeader('x-ecc-contract-version', entry.contract_version || 'v1');
        res.setHeader('x-ecc-route-canonical', String(entry.canonical ?? false));
    }
}
