function ensureOverlay(){
  let el = document.getElementById('ecc-crash-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ecc-crash-overlay';
    el.style.cssText = `
      position:fixed;inset:0;z-index:999999;
      background:rgba(10,10,10,.85); color:#fff; font:14px/1.45 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
      padding:16px; display:none; overflow:auto;
    `;
    document.body.appendChild(el);
  }
  return el;
}

function show(msg:string){
  const el = ensureOverlay();
  el.innerHTML = '<div style="max-width:960px;margin:24px auto"><h2 style="margin:0 0 12px">ECC Runtime Error</h2><pre style="white-space:pre-wrap;background:#111;padding:12px;border-radius:8px;border:1px solid #333">'+msg+'</pre></div>';
  (el as HTMLElement).style.display='block';
  console.error('[ECC] Runtime Error:', msg);
}

// Initialize crash overlay
window.addEventListener('error', (e)=> show(String(e.error?.stack||e.message||e)));
window.addEventListener('unhandledrejection', (e:any)=> show(String(e.reason?.stack||e.reason||e)));

// Export something to make this a proper ES module
export {};
