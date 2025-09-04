// src/dev/auditPortfolio.ts
// Dev-only auditor for Portfolio data coverage verification

export async function runPortfolioAudit() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;
  
  try {
    console.log('🔍 Portfolio Data Audit - Field Coverage Analysis');
    console.log('='.repeat(60));

    // Fetch all endpoints
    const endpoints = [
      { name: 'Properties', url: '/api/portfolio/properties', fields: ['name', 'type', 'class', 'state', 'city', 'zip', 'units', 'occPct', 'active'] },
      { name: 'Units', url: '/api/portfolio/units', fields: ['propertyName', 'unitLabel', 'beds', 'baths', 'sqft', 'status', 'marketRent'] },
      { name: 'Leases', url: '/api/portfolio/leases', fields: ['propertyName', 'unitLabel', 'tenants', 'status', 'start', 'end', 'rent'] },
      { name: 'Tenants', url: '/api/portfolio/tenants', fields: ['name', 'email', 'phone', 'propertyName', 'unitLabel', 'type', 'balance'] },
      { name: 'Owners', url: '/api/portfolio/owners', fields: ['company', 'email', 'phone', 'active'] }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (!response.ok) {
          console.warn(`⚠️ ${endpoint.name}: HTTP ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        const items = Array.isArray(data) ? data : [];
        
        if (items.length === 0) {
          console.log(`📊 ${endpoint.name}: No data`);
          continue;
        }

        // Calculate coverage for each field
        const coverage: Record<string, number> = {};
        
        for (const field of endpoint.fields) {
          const validCount = items.filter(item => {
            const value = item[field];
            return value != null && value !== '' && value !== '—' && 
                   !(Array.isArray(value) && value.length === 0);
          }).length;
          
          coverage[field] = Math.round((validCount / items.length) * 100);
        }

        // Format coverage report
        const coverageStr = endpoint.fields
          .map(field => `${field} ${coverage[field]}%`)
          .join(' | ');
        
        console.log(`📊 ${endpoint.name} coverage: ${coverageStr}`);
        
        // Show first 3 items (keys only)
        console.log(`   Sample keys: ${items.slice(0, 3).map(item => 
          `{${Object.keys(item).join(', ')}}`
        ).join(' | ')}`);
        
        // Special tenant analysis
        if (endpoint.name === 'Tenants') {
          const leaseTenantsCount = items.filter(t => 
            t.type && t.type.toLowerCase().includes('lease')
          ).length;
          const prospectCount = items.filter(t => 
            t.type && t.type.toLowerCase().includes('prospect')
          ).length;
          console.log(`   Type breakdown: ${leaseTenantsCount} lease tenants, ${prospectCount} prospects`);
        }

      } catch (error) {
        console.warn(`⚠️ ${endpoint.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    // Fail silently in production paths
    console.error('Audit error:', error);
  }
}