import React, { useState } from "react";
import { fetchJSON } from "@/lib/http";

export default function PlannerModal({
  open,
  onClose,
  entity_type,
  entity_id,
}: {
  open: boolean;
  onClose: () => void;
  entity_type: string;
  entity_id: string | number;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [due, setDue] = useState("");

  if (!open) return null;

  // INLINE, IN-PANEL: never cover the page
  return (
    <section className="ecc-object" role="dialog" aria-modal="false" aria-label="New Planner Task">
      <div className="ecc-header">
        <div className="ecc-title">New Planner Task</div>
        <div className="ecc-actions" style={{ display: "flex", gap: 8 }}>
          <button className="ecc-object" onClick={onClose} style={{ padding: "8px 12px" }}>Close</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <input
          className="ecc-object"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px 10px" }}
        />
        <textarea
          className="ecc-object"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ padding: "8px 10px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ecc-label">Due</span>
          <input
            type="date"
            className="ecc-object"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            style={{ padding: "6px 8px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="ecc-object" onClick={onClose} style={{ padding: "8px 12px" }}>Cancel</button>
          <button
            className="ecc-object"
            style={{ padding: "8px 12px" }}
            onClick={async () => {
              try {
                await fetchJSON("/api/m365/planner/tasks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title, notes, due_date: due, entity_type, entity_id }),
                });
                onClose();
              } catch (error) {
                alert(error.message);
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
    </section>
  );
}