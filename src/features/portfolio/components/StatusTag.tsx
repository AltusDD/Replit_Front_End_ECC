import React from "react";

type Props = { value?: string | null };

export default function StatusTag({ value }: Props) {
  const v = (value ?? "").toString().toLowerCase();
  let cls = "ecc-badge";
  if (["active","occupied","ok","true","yes"].includes(v)) cls += " ecc-badge--ok";
  else if (["ended","vacant","unknown","inactive","false","no"].includes(v)) cls += " ecc-badge--warn";
  else if (["litigation","past_due","delinquent"].includes(v)) cls += " ecc-badge--bad";
  else cls += " ecc-badge--warn";
  return <span className={cls}>{(value ?? "").toString().toUpperCase() || "—"}</span>;
}