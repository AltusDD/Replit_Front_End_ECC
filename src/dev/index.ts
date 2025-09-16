export async function enableInspector(){
  const p=new URL(location.href);
  if(p.searchParams.get('debug')!=='1') return;
  // global error capture
  try{
    window.addEventListener('error', (e) => {
      try { fetch('/__audit?name=client_errors', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ type:'window_error', message:String(e?.message||e), stack:String(e?.error?.stack||''), route: location.pathname+location.search, ts: new Date().toISOString() }) }); } catch {}
    });
    window.addEventListener('unhandledrejection', (e:any) => {
      try { fetch('/__audit?name=client_errors', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ type:'unhandledrejection', reason:String(e?.reason||''), route: location.pathname+location.search, ts: new Date().toISOString() }) }); } catch {}
    });
  }catch{}
  const { UiInspector } = await import('./UiInspector');
  const host=document.createElement('div'); host.id='ecc-ui-inspector-root'; document.body.appendChild(host);
  UiInspector.mount('#ecc-ui-inspector-root');
}
enableInspector();