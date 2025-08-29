import Nav from './Nav'
// [locked by style-contract] '../../styles/app.css'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar"><Nav/></aside>
      <main className="content">{children}</main>
    </div>
  )
}
