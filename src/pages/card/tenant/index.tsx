import { useRoute } from "wouter";

export default function TenantCard(){
  const [, params] = useRoute("/card/tenant/:id");
  const id = Number(params?.id);
  return (
    <div className="panel" style={{padding:16}} data-testid="card-tenant">
      <h1>Tenant Card</h1>
      <p className="badge">Tenant ID: {Number.isFinite(id) ? id : 0}</p>
      <p className="badge">Stub • /card/tenant/:id</p>
    </div>
  );
}