import Table from '@/components/ui/Table';
import { useCollection } from '@lib/useApi';
function nm(r:any){return r.display_name??r.name??r.property_name??r.full_name??r.company_name??r.address1??'(unnamed)'}
function ct(r:any){return r.city??r.property_city??r.mailing_city??''}
function st(r:any){return r.state??r.property_state??r.mailing_state??''}
function up(r:any){return r.updated_at??r.updatedAt??r.modified_at??r.modifiedAt??''}
export function PageFor({entity}:{entity:string}) {
  const {data,loading,error}=useCollection<any>(entity,{order:'updated_at.desc',limit:200});
  const rows=(data||[]).map((r:any)=>({...r,__name:nm(r),__city:ct(r),__state:st(r),__updated:up(r)}));
  return (<div style={{display:'grid',gap:12}}>
    <h1 style={{textTransform:'capitalize'}}>{entity}</h1>
    <div style={{color:'var(--muted)'}}>{loading?'Loading…':error?String(error):`Loaded ${rows.length} ${entity}.`}</div>
    <Table columns={[
      {key:'__name',label:'Name'},{key:'__city',label:'City'},
      {key:'__state',label:'State',width:80},{key:'__updated',label:'Updated'}
    ]} rows={rows}/>
  </div>);
}
