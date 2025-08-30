set -euo pipefail

# Update table columns for each portfolio entity per ECC specs and your screenshots

gen_entity () {
  local Pretty="$1"; local coll="$2"; shift 2; local -a cols=("$@")
  mkdir -p "src/pages/portfolio/$coll"
  cat > "src/pages/portfolio/$coll/index.tsx" <<TSX
import Table from "@/components/ui/Table";
import { useCollection } from "@lib/useApi";

const cols = [
  ${cols[*]}
];

export default function ${Pretty}(){
  const {data, loading, error} = useCollection("${coll}", { order:'updated_at.desc', limit: 200 });

  return (
    <>
      <h1 className="pageTitle">${Pretty}</h1>
      {error ? <div className="panel" style={{padding:12,marginBottom:12}}>API error: {String(error.message||error)}</div> : null}
      <Table<any>
        rows={loading ? [] : data}
        cols={cols}
        cap={\`Loaded \${data.length} ${Pretty.toLowerCase()}\`}
        empty={loading ? 'Loading…' : 'No results'}
      />
    </>
  );
}
TSX
}

# Properties
gen_entity "Properties" properties \
  "{ key:'name', label:'Name' }" \
  "{ key:'address_city', label:'City' }" \
  "{ key:'address_state', label:'State' }" \
  "{ key:'updated_at', label:'Updated', render:(r:any)=> r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }"

# Units
gen_entity "Units" units \
  "{ key:'unit_number', label:'Name' }" \
  "{ key:'beds', label:'Beds' }" \
  "{ key:'rent_amount', label:'Rent', render:(r:any)=> r.rent_amount ? '$'+r.rent_amount : '' }" \
  "{ key:'updated_at', label:'Updated', render:(r:any)=> r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }"

# Leases
gen_entity "Leases" leases \
  "{ key:'property_id', label:'Property ID' }" \
  "{ key:'unit_id', label:'Unit ID' }" \
  "{ key:'rent_cents', label:'Rent', render:(r:any)=> r.rent_cents ? '$'+(r.rent_cents/100).toFixed(2) : '' }" \
  "{ key:'status', label:'Status' }" \
  "{ key:'updated_at', label:'Updated', render:(r:any)=> r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }"

# Tenants
gen_entity "Tenants" tenants \
  "{ key:'display_name', label:'Name' }" \
  "{ key:'type', label:'Type' }" \
  "{ key:'email', label:'Email' }" \
  "{ key:'updated_at', label:'Updated', render:(r:any)=> r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }"

# Owners
gen_entity "Owners" owners \
  "{ key:'display_name', label:'Name' }" \
  "{ key:'company_name', label:'Company' }" \
  "{ key:'notes', label:'Contact' }" \
  "{ key:'active', label:'Active', render:(r:any)=> r.active ? 'Yes' : 'No' }" \
  "{ key:'updated_at', label:'Updated', render:(r:any)=> r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '' }"

echo "✅ All portfolio pages updated with correct field mappings"
