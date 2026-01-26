import { useRoute } from "wouter";

export default function LeaseCard(){
  const [, params] = useRoute("/card/lease/:id");
  const id = Number(params?.id);
  return (
    <div className="panel" style={{padding:16}} data-testid="card-lease">
      <h1>Lease Card</h1>
      <p className="badge">Lease ID: {Number.isFinite(id) ? id : 0}</p>
      <p className="badge">Stub • /card/lease/:id</p>
    </div>
  );
}