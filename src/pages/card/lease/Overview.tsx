export default function Overview({ data }: { data: any }) {
  if (!data) return null; // shell shows skeleton

  const lease = data?.lease;
  const property = data?.property;
  const unit = data?.unit;
  const tenant = data?.tenant;

  const propName = property?.display_name || property?.name || property?.street_1 || null;
  const unitName = unit?.unit_number || unit?.label || null;
  const tenantName = tenant?.display_name || tenant?.name || null;

  const rows = [
    { label:'Property', value: propName, href: property?`/card/property/${property.id}`:undefined },
    { label:'Unit', value: unitName, href: unit?`/card/unit/${unit.id}`:undefined },
    { label:'Primary Tenant', value: tenantName, href: tenant?`/card/tenant/${tenant.id}`:undefined },
    { label:'Status', value: lease?.status || null },
    { label:'Start Date', value: lease?.start_date || null },
    { label:'End Date', value: lease?.end_date || null },
    { label:'Monthly Rent', value: lease?.rent_cents ? `$${Math.round(lease.rent_cents/100)}` : null },
  ];

  return (
    <div className="space-y-3">
      {rows.map(row => (
        <div key={row.label} className="flex justify-between">
          <span className="font-medium">{row.label}</span>
          {row.href ? (
            <a href={row.href} className="text-blue-400 hover:underline">{row.value}</a>
          ) : (
            <span>{row.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}