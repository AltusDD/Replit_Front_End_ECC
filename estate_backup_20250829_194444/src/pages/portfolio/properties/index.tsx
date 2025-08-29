import React from 'react';
import ListPage from '../_ListPage';

export default function PropertiesPage(){
  const columns = [
    { key:'name', header:'Property' },
    { key:'address', header:'Address' },
    { key:'city', header:'City' },
    { key:'state', header:'State', className:'' },
    { key:'units', header:'Units', className:'num' },
  ];
  return <ListPage title="Properties" path="/api/properties?limit=25" columns={columns as any} />;
}
