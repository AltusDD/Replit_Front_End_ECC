// Genesis Grade Dashboard Page - The Definitive SFR Command Center

import React from 'react';
import '../../../styles/Dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* KPI Ticker - Full Width */}
      <div className="kpi-ticker-container panel">
        <h2>KPI Ticker</h2>
        <p>Portfolio health metrics will be displayed here</p>
      </div>

      {/* Main Grid - Map (2/3) + Feed (1/3) */}
      <div className="main-grid">
        <div className="map-container panel">
          <h2>Portfolio Operations Map</h2>
          <p>Interactive property map will be displayed here</p>
        </div>
        <div className="feed-container panel">
          <h2>Priority Action Feed</h2>
          <p>Priority actions and alerts will be displayed here</p>
        </div>
      </div>

      {/* Financials and Leasing - Split Row */}
      <div className="financials-container panel">
        <h2>Financials</h2>
        <p>Cash flow and financial metrics will be displayed here</p>
      </div>
      
      <div className="leasing-container panel">
        <h2>Leasing Funnel</h2>
        <p>Leasing pipeline and conversion metrics will be displayed here</p>
      </div>

      {/* Occupancy by City - Full Width */}
      <div className="city-occupancy-container panel">
        <h2>Occupancy by City</h2>
        <p>City-level occupancy breakdown will be displayed here</p>
      </div>
    </div>
  );
}