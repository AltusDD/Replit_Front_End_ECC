import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';

export function CollectionView({ col, title }: { col: string; title: string }) {
  const { data, loading, error } = useCollection(col);
  return (
    <div>
      <h1>{title}</h1>
      {error && <div className="panel">API error: {String(error.message || error)}</div>}
      {loading ? <div className="panel">Loading…</div> : <Table rows={data} />}
    </div>
  );
}
