import Nav from './Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100vh' }}>
      <aside style={{ borderRight: '1px solid var(--border)', padding: '16px', background: 'var(--panel)' }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Empire Command Center</div>
        <Nav />
      </aside>
      <main style={{ padding: '24px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
