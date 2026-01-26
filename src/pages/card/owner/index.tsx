import { useRoute } from "wouter";

export default function OwnerCard(){
  const [, params] = useRoute("/card/owner/:id");
  const id = Number(params?.id);
  return (
    <div className="panel" style={{padding:16}} data-testid="card-owner">
      <h1>Owner Card</h1>
      <p className="badge">Owner ID: {Number.isFinite(id) ? id : 0}</p>
      <p className="badge">Stub • /card/owner/:id</p>
    </div>
  );
}