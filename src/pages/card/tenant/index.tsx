import { useParams } from "wouter";

export default function TenantCard(){
  const { id } = useParams();
  return (
    <div className="panel" style={{padding:16}}>
      <h1>Tenant Card</h1>
      <p className="badge">Tenant ID: {id}</p>
      <p className="badge">Stub • /card/tenant/:id</p>
    </div>
  );
}