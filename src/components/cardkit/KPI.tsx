import * as React from "react";

type KPIProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: React.ReactNode;
  "data-testid"?: string;
  testid?: string; // legacy
};

const KPIBase: React.FC<KPIProps> = ({ label, value, testid, ...rest }) => {
  const dataTestid = rest["data-testid"] ?? testid;
  const { className, ...dom } = rest;
  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value ?? "—"}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);