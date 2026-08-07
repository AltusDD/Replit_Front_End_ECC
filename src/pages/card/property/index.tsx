import { useRoute } from "wouter";

export default function PropertyCard(){
  const [, params] = useRoute("/card/property/:id");
  const id = Number(params?.id);
  return (
    <div className="panel" style={{padding:16}} data-testid="card-property">
      <h1>Property Card</h1>
      <p className="badge">Property ID: {Number.isFinite(id) ? id : 0}</p>
      <p className="badge">Stub • /card/property/:id</p>
    </div>
  );
}