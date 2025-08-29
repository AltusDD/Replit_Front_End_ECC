type Col<T=any> = { key: string; label: string; render?: (row: T) => React.ReactNode; width?: number|string };
export default function Table<T=any>({ columns, rows }: { columns: Col<T>[]; rows: T[] }) {
  return (
    <div className="panel">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 12, color: 'var(--muted)' }}>
                No data.
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>
                    {c.render ? c.render(r) : (r as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
