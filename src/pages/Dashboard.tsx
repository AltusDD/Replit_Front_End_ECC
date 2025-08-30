import { useState, useEffect } from 'react';

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalClients: number;
  recentActivities: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    totalClients: 0,
    recentActivities: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // In a real app, these would be API calls to your backend
        // For now, we'll simulate the data structure
        setStats({
          totalProperties: 156,
          activeListings: 89,
          totalClients: 234,
          recentActivities: 12,
        });

        setActivities([
          {
            id: '1',
            type: 'property',
            description: 'New property listing added: 123 Oak Street',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: '2',
            type: 'client',
            description: 'Client meeting scheduled with Johnson family',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            id: '3',
            type: 'sale',
            description: 'Property sold: 456 Pine Avenue - $485,000',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return '🏠';
      case 'client':
        return '👥';
      case 'sale':
        return '💰';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#666' }}>Welcome to your Empire Command Center</p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          className="bg-white border rounded-lg p-6"
          style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-sm" style={{ color: '#666', marginBottom: '0.25rem' }}>
                Total Properties
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                {stats.totalProperties}
              </p>
            </div>
            <div style={{ fontSize: '2rem' }}>🏠</div>
          </div>
        </div>

        <div
          className="bg-white border rounded-lg p-6"
          style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-sm" style={{ color: '#666', marginBottom: '0.25rem' }}>
                Active Listings
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                {stats.activeListings}
              </p>
            </div>
            <div style={{ fontSize: '2rem' }}>📋</div>
          </div>
        </div>

        <div
          className="bg-white border rounded-lg p-6"
          style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-sm" style={{ color: '#666', marginBottom: '0.25rem' }}>
                Total Clients
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                {stats.totalClients}
              </p>
            </div>
            <div style={{ fontSize: '2rem' }}>👥</div>
          </div>
        </div>

        <div
          className="bg-white border rounded-lg p-6"
          style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-sm" style={{ color: '#666', marginBottom: '0.25rem' }}>
                Recent Activities
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                {stats.recentActivities}
              </p>
            </div>
            <div style={{ fontSize: '2rem' }}>⚡</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div
        className="bg-white border rounded-lg"
        style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      >
        <div className="p-6" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Activities</h2>
        </div>
        <div>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="p-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#374151', marginBottom: '0.25rem' }}>
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p style={{ color: '#6b7280' }}>No recent activities</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <button
            className="bg-blue-600 text-white rounded-lg p-4"
            style={{ textAlign: 'left', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏠</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Add Property</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>List a new property</div>
          </button>

          <button
            className="bg-white border rounded-lg p-4"
            style={{ textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#374151' }}>
              Add Client
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Register new client</div>
          </button>

          <button
            className="bg-white border rounded-lg p-4"
            style={{ textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#374151' }}>
              View Reports
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Analytics & insights</div>
          </button>
        </div>
      </div>
    </div>
  );
}
