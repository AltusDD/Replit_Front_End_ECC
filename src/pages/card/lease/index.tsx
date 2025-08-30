import { useParams } from "wouter";

export default function LeaseCard(){
  const { id } = useParams();
  return (
    <div className="panel" style={{padding:16}}>
      <h1>Lease Card</h1>
      <p className="badge">Lease ID: {id}</p>
      <p className="badge">Stub • /card/lease/:id</p>
    </div>
  );
}