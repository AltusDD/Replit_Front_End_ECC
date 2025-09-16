import React from "react";
export function Widget({title, children}:{title:string;children:React.ReactNode}){
  return (
    <div className="card">
      <div className="card-head"><div className="h2">{title}</div></div>
      <div className="card-body">{children}</div>
    </div>
  );
}
export default function RightRail({children}:{children:React.ReactNode}){ return <>{children}</>; }