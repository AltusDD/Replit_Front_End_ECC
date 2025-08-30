import React from 'react';
const Card = ({title,value}:{title:string,value:string}) => (
  <div className="panel kpi"><h3>{title}</h3><div className="num">{value}</div></div>
);

export default function Dashboard(){
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="kpi-grid">
        <Card title="Properties" value="47"/>
        <Card title="Units" value="312"/>
        <Card title="Leases" value="298"/>
        <Card title="Tenants" value="291"/>
        <Card title="Owners" value="12"/>
      </div>
      <div className="hr"/>
      <div className="panel" style={{padding:16,marginTop:12}}>
        <h2>Operations Center</h2>
        <p className="badge">No tables in dashboard per Altus guardrails</p>
      </div>
    </div>
  );
}