import { useParams } from "wouter";

export default function UnitCard(){
  const { id } = useParams();
  return (
    <div className="panel" style={{padding:16}}>
      <h1>Unit Card</h1>
      <p className="badge">Unit ID: {id}</p>
      <p className="badge">Stub • /card/unit/:id</p>
    </div>
  );
}