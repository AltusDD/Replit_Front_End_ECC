import React from 'react';
import ListPage from '../_ListPage';

export default function LeasesPage(){
  const columns = [
    { key:'leaseNumber', header:'Lease #' },
    { key:'tenant', header:'Tenant' },
    { key:'property', header:'Property' },
    { key:'start', header:'Start' },
    { key:'end', header:'End' },
  ];
  return <ListPage title="Leases" path="/api/leases?limit=25" columns={columns as any} />;
}
