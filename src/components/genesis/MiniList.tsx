import React from "react";
export function MiniRow({title,meta,href}:{title:string;meta?:string;href?:string}){
  return (
    <a href={href||"#"} className="row">
      <div className="title">{title}</div>
      {meta? <small>{meta}</small> : <span/>}
    </a>
  );
}
export default function MiniList({items,empty}:{items:Array<{title:string;meta?:string;href:string}>; empty?:string}){
  if(!items?.length) return <div className="meta">{empty||"No linked records."}</div>;
  return <div className="list">{items.map((it,i)=><MiniRow key={i} {...it}/>)}</div>;
}