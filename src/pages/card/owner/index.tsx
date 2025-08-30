import { useParams } from "wouter";

export default function OwnerCard(){
  const { id } = useParams();
  return (
    <div className="panel" style={{padding:16}}>
      <h1>Owner Card</h1>
      <p className="badge">Owner ID: {id}</p>
      <p className="badge">Stub • /card/owner/:id</p>
    </div>
  );
}