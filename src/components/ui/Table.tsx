type Row = Record<string, any>
export default function Table({ rows }: { rows: Row[] }) {
  if (!rows?.length) return <div className="panel">No results</div>
  const cols = Object.keys(rows[0] ?? {})
  return (
    <div className="panel">
      <table className="table">
        <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{String(r[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
