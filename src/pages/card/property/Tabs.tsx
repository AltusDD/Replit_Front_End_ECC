import React, { useState } from 'react';
import { PropertyCardDTO } from '../types';
import Overview from './Overview';
import Details from './Details';
import Financials from './Financials';
import Legal from './Legal';
import Files from './Files';
import Linked from './Linked';
import Activity from './Activity';

interface TabsProps {
  data: PropertyCardDTO;
}

const tabs = [
  { id: 'overview', label: 'Overview', component: Overview },
  { id: 'details', label: 'Details', component: Details },
  { id: 'financials', label: 'Financials', component: Financials },
  { id: 'legal', label: 'Legal', component: Legal },
  { id: 'files', label: 'Files', component: Files },
  { id: 'linked', label: 'Linked', component: Linked },
  { id: 'activity', label: 'Activity', component: Activity }
];

export default function Tabs({ data }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Overview;

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--gap-1)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 'var(--gap-3)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--surface-2)' : 'transparent',
              border: 'none',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-subtle)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              fontSize: 'var(--fs-14)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--gap-4)',
        minHeight: '400px'
      }}>
        <ActiveComponent data={data} />
      </div>
    </div>
  );
}