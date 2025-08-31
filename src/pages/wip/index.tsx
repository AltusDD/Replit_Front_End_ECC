import { useRoute } from "wouter";
export default function Wip(){
  const [, params] = useRoute("/wip/:rest*");
  const title = (params?.rest || "").split("/").map(s=>s.replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase())).join(" / ");
  return (
    <>
      <h1 className="pageTitle">{title || "Coming Soon"}</h1>
      <div className="panel" style={{padding:12}}>
        This section is scaffolded. Routes are wired; UI coming next.
      </div>
    </>
  );
}
