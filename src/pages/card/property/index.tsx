import { useParams } from "wouter";

export default function PropertyCard(){
  const { id } = useParams();
  return (
    <div className="panel" style={{padding:16}}>
      <h1>Property Card</h1>
      <p className="badge">Property ID: {id}</p>
      <p className="badge">Stub • /card/property/:id</p>
    </div>
  );
}