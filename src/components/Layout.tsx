import Nav from './Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%' }}>
      <aside style={{ borderRight: '1px solid var(--border)', padding: 16, background: 'var(--panel)' }}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>Empire Command Center</div>
        <Nav />
      </aside>
      <main style={{ padding: 20, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
