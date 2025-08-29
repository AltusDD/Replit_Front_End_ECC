import React from 'react';
import Nav from './Nav';

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="app">
      <aside className="rail"><Nav/></aside>
      <main className="content">{children}</main>
    </div>
  );
}
