export function toCSV<T extends Record<string, any>>(rows: T[], columns: { key: string; header: string }[]) {
  const header = columns.map(c => safe(c.header)).join(",");
  const body = rows.map(r => columns.map(c => safe(r?.[c.key])).join(",")).join("\n");
  return header + "\n" + body;
}
function safe(v: any) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}
export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}