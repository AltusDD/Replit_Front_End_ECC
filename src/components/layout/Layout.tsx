import Nav from "./Nav";
import React from "react";
export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="layout">
      <Nav />
      <main className="main">
        {children}
      </main>
    </div>
  );
}