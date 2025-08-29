import Nav from './Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Empire Command Center</div>
        <Nav />
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}