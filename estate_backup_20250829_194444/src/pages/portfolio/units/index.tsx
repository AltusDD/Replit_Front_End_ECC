import React from 'react';
import ListPage from '../_ListPage';

export default function UnitsPage(){
  const columns = [
    { key:'unit', header:'Unit' },
    { key:'property', header:'Property' },
    { key:'beds', header:'Beds', className:'num' },
    { key:'baths', header:'Baths', className:'num' },
    { key:'status', header:'Status' },
  ];
  return <ListPage title="Units" path="/api/units?limit=25" columns={columns as any} />;
}
