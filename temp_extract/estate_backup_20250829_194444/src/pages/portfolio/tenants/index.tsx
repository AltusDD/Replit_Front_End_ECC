import React from 'react';
import ListPage from '../_ListPage';

export default function TenantsPage(){
  const columns = [
    { key:'name', header:'Tenant' },
    { key:'email', header:'Email' },
    { key:'phone', header:'Phone' },
    { key:'status', header:'Status' },
  ];
  return <ListPage title="Tenants" path="/api/tenants?limit=25" columns={columns as any} />;
}
