import React from 'react';
import ListPage from '../_ListPage';

export default function OwnersPage(){
  const columns = [
    { key:'name', header:'Owner' },
    { key:'email', header:'Email' },
    { key:'phone', header:'Phone' },
    { key:'portfolio', header:'Portfolio', className:'num' },
  ];
  return <ListPage title="Owners" path="/api/owners?limit=25" columns={columns as any} />;
}
