/**
 * Altus Runtime Hotfix — forces neutral charcoal palette + logo clamp
 * Works even if other CSS or libraries override styles, by injecting
 * a high-specificity <style> at runtime.
 */
(function applyAltusHotfix(){
  try {
    const html = document.documentElement;
    if (!html.getAttribute('data-theme')) html.setAttribute('data-theme','altus');

    const css = `
:root[data-theme="altus"]{
  --color-background:#1A1A1A; --color-panel:#212121; --color-surface:#1E1E1E; --color-border:#2E2E2E;
  --color-text-primary:#FFFFFF; --color-text-secondary:#B0B0B0; --color-text-muted:#9A9A9A;
  --color-accent:#FFD700; --color-accent-contrast:#111111;
  --table-row-alt:#1B1B1B; --table-row-hover:#252525; --table-head-bg:#171717;
}
:root[data-theme="altus"] body{ background:#1A1A1A !important; color:#FFFFFF !important; }
:root[data-theme="altus"] .panel{ background:#212121 !important; border:1px solid #2E2E2E !important; }
:root[data-theme="altus"] .table{ background:#212121 !important; border:1px solid #2E2E2E !important; }
:root[data-theme="altus"] .table thead th{ background:#171717 !important; color:#FFFFFF !important; }
:root[data-theme="altus"] .table tbody tr:nth-child(even){ background:#1B1B1B !important; }
:root[data-theme="altus"] .table tbody tr:hover{ background:#252525 !important; }
:root[data-theme="altus"] a[aria-current="page"], :root[data-theme="altus"] .active{ color:#FFD700 !important; }
:root[data-theme="altus"] header img, :root[data-theme="altus"] .header-logo, 
:root[data-theme="altus"] .brand, :root[data-theme="altus"] .logo,
:root[data-theme="altus"] .content>img:first-of-type, :root[data-theme="altus"] main>img:first-of-type{
  max-height:96px !important; height:auto !important; width:auto !important; display:block !important;
}
`;
    let tag = document.getElementById('altus-runtime-hotfix') as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'altus-runtime-hotfix';
      tag.type = 'text/css';
      document.head.appendChild(tag);
    }
    if (tag.textContent !== css) tag.textContent = css;
  } catch(e) {
    console.warn('Altus hotfix failed', e);
  }
})();
