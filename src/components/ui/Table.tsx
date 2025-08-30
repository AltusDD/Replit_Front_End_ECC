type Col<T> = { key: keyof T | string; label: string; render?: (row:T)=>React.ReactNode; width?: number|string; };
export default function Table<T extends Record<string,any>>({
  rows, cols, empty='No results', cap
}:{ rows:T[]; cols:Col<T>[]; empty?:string; cap?:string }){
  return (
    <div className="panel" style={{padding:12}}>
      {cap ? <div style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>{cap}</div> : null}
      <table className="table">
        <thead><tr>{cols.map((c,i)=><th key={i} style={{width:c.width}}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.length===0 ? <tr><td>{empty}</td></tr> :
            rows.map((r,ri)=><tr key={ri}>
              {cols.map((c,ci)=>{
                const val = c.render ? c.render(r) : (r[c.key as string] ?? '');
                return <td key={ci}>{String(val)}</td>;
              })}
            </tr>)}
        </tbody>
      </table>
    </div>
  );
}