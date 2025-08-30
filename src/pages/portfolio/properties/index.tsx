import { useCollection } from "@lib/useApi";

export default function Properties(){
  const {data, loading, error} = useCollection("properties");
  return (
    <>
      <h1 className="pageTitle">Properties</h1>
      {error && <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div>}
      <div className="panel" style={{padding:12}}>
        <table className="table">
          <thead><tr>{Object.keys((data[0]||{})).slice(0,7).map(k=><th key={k}>{k}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td>Loading…</td></tr> :
              data.length === 0 ? <tr><td>No results</td></tr> :
              data.slice(0,50).map((row:any,i:number)=>(
                <tr key={i}>{Object.entries(row).slice(0,7).map(([k,v])=> <td key={k}>{String(v)}</td>)}</tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}
