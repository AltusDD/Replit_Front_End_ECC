export type NavItem={label:string,href:string,section:'PRIMARY'|'PORTFOLIO'|'TOOLS'};
export const NAV:NavItem[]=[
  {section:'PRIMARY',label:'Dashboard',href:'/dashboard'},
  {section:'PORTFOLIO',label:'Properties',href:'/portfolio/properties'},
  {section:'PORTFOLIO',label:'Units',href:'/portfolio/units'},
  {section:'PORTFOLIO',label:'Leases',href:'/portfolio/leases'},
  {section:'PORTFOLIO',label:'Tenants',href:'/portfolio/tenants'},
  {section:'PORTFOLIO',label:'Owners',href:'/portfolio/owners'},
  {section:'TOOLS',label:'API Probe',href:'/tools/probe'}
];