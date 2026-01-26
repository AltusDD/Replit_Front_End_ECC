import { useRoute } from "wouter";

export default function UnitCard(){
  const [, params] = useRoute("/card/unit/:id");
  const id = Number(params?.id);
  return (
    <div className="panel" style={{padding:16}} data-testid="card-unit">
      <h1>Unit Card</h1>
      <p className="badge">Unit ID: {Number.isFinite(id) ? id : 0}</p>
      <p className="badge">Stub • /card/unit/:id</p>
    </div>
  );
}