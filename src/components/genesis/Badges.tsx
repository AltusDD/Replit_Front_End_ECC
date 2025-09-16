import React from "react";
export default function Badges({doorloop,corelogic,m365,dropbox}:{doorloop?:boolean;corelogic?:boolean;m365?:boolean;dropbox?:boolean}){
  const items = [
    doorloop && {k:"DL", lbl:"DoorLoop"},
    corelogic && {k:"CL", lbl:"CoreLogic"},
    m365 && {k:"M365", lbl:"Microsoft 365"},
    dropbox && {k:"DBX", lbl:"Dropbox"},
  ].filter(Boolean) as any[];
  if(!items.length) return null;
  return <div className="badges">{items.map((b:any)=>(<span key={b.k} className="badge">{b.lbl}</span>))}</div>;
}