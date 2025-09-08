create or replace view public.v_property_full_address as
select
  p.id,
  (
    coalesce(nullif(trim(p.street), ''), nullif(trim(p.address), ''), nullif(trim(p.address1), ''), nullif(trim(p.address_line1), ''), nullif(trim(p.line1), ''))
    || ', ' ||
    coalesce(nullif(trim(p.city), ''), '')
    || ', ' ||
    coalesce(nullif(trim(p.state), ''), '')
    || ' ' ||
    coalesce(nullif(trim(p.zip), ''), '')
  ) as full_address
from public.properties p
where
  coalesce(nullif(trim(p.city), ''), '') <> ''
  and coalesce(nullif(trim(p.state), ''), '') <> '';