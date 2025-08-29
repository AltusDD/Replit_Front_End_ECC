import StatCard from '@/components/ui/StatCard'
import { useCounts } from '@lib/useApi'

export default function Dashboard(){
  const { data, loading, error } = useCounts()
  const safe = (k:string) => (data?.[k] ?? '…')

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <div className="panel">API error: {String(error.message || error)}</div>}

      <div className="grid-5 mt-16">
        <StatCard label="Properties" value={safe('properties')} loading={loading}/>
        <StatCard label="Units"      value={safe('units')}      loading={loading}/>
        <StatCard label="Leases"     value={safe('leases')}     loading={loading}/>
        <StatCard label="Tenants"    value={safe('tenants')}    loading={loading}/>
        <StatCard label="Owners"     value={safe('owners')}     loading={loading}/>
      </div>

      <div className="panel mt-16">
        <div className="badge">Powered by RPC</div>
      </div>
    </div>
  )
}
