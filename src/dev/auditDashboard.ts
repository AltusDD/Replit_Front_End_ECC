// src/dev/auditDashboard.ts - Dashboard Data Coverage Auditor
import {
  MOCK_PROPERTIES,
  MOCK_TENANTS,
  MOCK_LEASES,
  MOCK_WORK_ORDERS,
  type Property,
  type TenantSummary,
  type Lease,
  type WorkOrder,
} from '../features/dashboard/api/mock-data';

interface CoverageStats {
  description: string;
  count: number;
  percentage?: number;
  details?: string;
}

export function runDashboardAudit() {
  try {
    console.log('🔍 DASHBOARD DATA AUDIT - Genesis Dashboard Coverage Report');
    console.log('=' .repeat(80));

    const stats: CoverageStats[] = [];

    // Properties Coverage
    const propertiesWithCoords = MOCK_PROPERTIES.filter(p => p.lat && p.lng);
    stats.push({
      description: 'Properties with lat/lng',
      count: propertiesWithCoords.length,
      percentage: (propertiesWithCoords.length / MOCK_PROPERTIES.length) * 100,
    });

    // Status counts
    const statusCounts = MOCK_PROPERTIES.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<Property['status'], number>);

    Object.entries(statusCounts).forEach(([status, count]) => {
      stats.push({
        description: `Properties - ${status}`,
        count,
        percentage: (count / MOCK_PROPERTIES.length) * 100,
      });
    });

    // Leases expiring soon
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 45);
    
    const expiringLeases = MOCK_LEASES.filter(lease => {
      const endDate = new Date(lease.endDate);
      return lease.status === 'active' && endDate >= now && endDate <= futureDate;
    });

    stats.push({
      description: 'Leases expiring ≤ 45 days',
      count: expiringLeases.length,
      details: `Active leases ending by ${futureDate.toISOString().split('T')[0]}`,
    });

    // Delinquent tenants
    const delinquentTenants = MOCK_TENANTS.filter(t => t.isDelinquent && t.balanceDue > 0);
    const totalDelinquency = delinquentTenants.reduce((sum, t) => sum + t.balanceDue, 0);
    
    stats.push({
      description: 'Delinquent tenants > $0',
      count: delinquentTenants.length,
      details: `Total owed: $${totalDelinquency.toLocaleString()}`,
    });

    // High priority work orders
    const highPriorityUnassigned = MOCK_WORK_ORDERS.filter(wo => 
      wo.priority === 'high' && !wo.assignedVendor
    );
    
    stats.push({
      description: 'High priority WOs unassigned',
      count: highPriorityUnassigned.length,
      details: `${MOCK_WORK_ORDERS.filter(wo => wo.priority === 'high').length} total high priority`,
    });

    // Cities coverage
    const cities = new Set(MOCK_PROPERTIES.map(p => p.city));
    stats.push({
      description: 'Unique cities',
      count: cities.size,
      details: Array.from(cities).join(', '),
    });

    // Display summary table
    console.table(stats.map(stat => ({
      Metric: stat.description,
      Count: stat.count,
      Percentage: stat.percentage ? `${stat.percentage.toFixed(1)}%` : '—',
      Details: stat.details || '—',
    })));

    console.log('\n📊 SAMPLE DATA SHAPES (Keys Only)');
    console.log('-'.repeat(50));

    // Log sample data shapes (keys only)
    const sampleProperty = MOCK_PROPERTIES[0];
    if (sampleProperty) {
      console.log('Properties[0] keys:', Object.keys(sampleProperty));
    }

    const sampleTenant = MOCK_TENANTS[0];
    if (sampleTenant) {
      console.log('Tenants[0] keys:', Object.keys(sampleTenant));
    }

    const sampleLease = MOCK_LEASES[0];
    if (sampleLease) {
      console.log('Leases[0] keys:', Object.keys(sampleLease));
    }

    const sampleWorkOrder = MOCK_WORK_ORDERS[0];
    if (sampleWorkOrder) {
      console.log('WorkOrders[0] keys:', Object.keys(sampleWorkOrder));
    }

    console.log('\n✅ Dashboard audit completed successfully');
    console.log(`Generated at: ${new Date().toISOString()}`);
    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Dashboard audit failed:', error);
    // Never throw - must not crash UI
  }
}