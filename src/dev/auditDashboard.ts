// src/dev/auditDashboard.ts - Dashboard Data Coverage Auditor (Real API Data)
export function runDashboardAudit() {
  try {
    console.log('🔍 DASHBOARD DATA AUDIT - Real Portfolio Data Coverage Report');
    console.log('=' .repeat(80));

    // Fetch real data for audit
    Promise.all([
      fetch('/api/portfolio/properties').then(r => r.json()),
      fetch('/api/portfolio/tenants').then(r => r.json()), 
      fetch('/api/portfolio/leases').then(r => r.json()),
      fetch('/api/portfolio/units').then(r => r.json()),
      fetch('/api/portfolio/owners').then(r => r.json()),
    ]).then(([properties, tenants, leases, units, owners]) => {
      const stats: Array<{ Metric: string; Count: number; Details: string }> = [];

      // Properties audit
      const propertiesWithCoords = properties.filter((p: any) => p.latitude || p.lat);
      stats.push({
        Metric: 'Properties with coordinates',
        Count: propertiesWithCoords.length,
        Details: `${((propertiesWithCoords.length / properties.length) * 100).toFixed(1)}%`,
      });

      stats.push({
        Metric: 'Total Properties',
        Count: properties.length,
        Details: 'From /api/portfolio/properties',
      });

      stats.push({
        Metric: 'Total Units', 
        Count: units.length,
        Details: 'From /api/portfolio/units',
      });

      stats.push({
        Metric: 'Total Tenants',
        Count: tenants.length, 
        Details: 'From /api/portfolio/tenants',
      });

      stats.push({
        Metric: 'Active Leases',
        Count: leases.filter((l: any) => l.status !== 'ended').length,
        Details: `${leases.length} total leases`,
      });

      const delinquentTenants = tenants.filter((t: any) => parseFloat(t.balance || '0') > 0);
      stats.push({
        Metric: 'Delinquent Tenants',
        Count: delinquentTenants.length,
        Details: `${((delinquentTenants.length / tenants.length) * 100).toFixed(1)}%`,
      });

      stats.push({
        Metric: 'Portfolio Owners',
        Count: owners.length,
        Details: 'From /api/portfolio/owners',
      });

      console.table(stats);

      console.log('\n📊 SAMPLE API RESPONSE SHAPES (Keys Only)');
      console.log('-'.repeat(50));

      if (properties[0]) {
        console.log('Properties[0] keys:', Object.keys(properties[0]));
      }
      if (tenants[0]) {
        console.log('Tenants[0] keys:', Object.keys(tenants[0]));
      }
      if (leases[0]) {
        console.log('Leases[0] keys:', Object.keys(leases[0]));
      }
      if (units[0]) {
        console.log('Units[0] keys:', Object.keys(units[0]));
      }
      if (owners[0]) {
        console.log('Owners[0] keys:', Object.keys(owners[0]));
      }

      console.log('\n✅ Real data audit completed successfully');
      console.log(`Generated at: ${new Date().toISOString()}`);
      console.log('=' .repeat(80));

    }).catch(error => {
      console.error('❌ Failed to fetch real portfolio data for audit:', error);
    });

  } catch (error) {
    console.error('❌ Dashboard audit failed:', error);
    // Never throw - must not crash UI
  }
}