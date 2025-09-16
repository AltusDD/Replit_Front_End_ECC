import React from "react";
import CardPanel from "@/components/cardkit/CardPanel";

export default function FieldGroup({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value?: React.ReactNode }[];
}) {
  return (
    <CardPanel title={title}>
      <div style={{ display: "grid", gap: 8 }}>
        {fields.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8 }}>
            <div style={{ opacity: 0.75 }}>{f.label}</div>
            <div>{f.value ?? "Not provided"}</div>
          </div>
        ))}
      </div>
    </CardPanel>
  );
}