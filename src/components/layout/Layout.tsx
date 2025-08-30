import Nav from './Nav';
export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="layout">
      <Nav />
      <main className="content">{children}</main>
    </div>
  );
}
