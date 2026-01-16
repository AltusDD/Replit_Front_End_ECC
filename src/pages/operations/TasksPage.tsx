export default function TasksPage() {
  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Tasks</h1>
          <p style={{ marginTop: 8, marginBottom: 0, opacity: 0.8 }}>
            Operational task work queue and controls.
          </p>
        </div>

        <div
          aria-label="headerExtra"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {["KPI: Open", "KPI: Due Today", "KPI: SLA Risk"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 10px",
                border: "1px dashed rgba(0,0,0,0.25)",
                borderRadius: 10,
                minWidth: 120,
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>--</div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-label="commandBar"
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
          padding: 12,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          background: "rgba(0,0,0,0.02)",
        }}
      >
        <button disabled type="button" style={{ padding: "8px 10px" }}>
          Create
        </button>
        <button disabled type="button" style={{ padding: "8px 10px" }}>
          Bulk Create
        </button>
        <button disabled type="button" style={{ padding: "8px 10px" }}>
          Recurring
        </button>
      </div>

      <div
        style={{
          padding: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Coming soon</div>
        <div style={{ opacity: 0.8 }}>
          This page is UI scaffolding only (no data wiring).
        </div>
      </div>
    </div>
  );
}
