import * as React from "react";
import { BLANK } from "@/lib/format";

type KPIProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: React.ReactNode;
  "data-testid"?: string;
  testid?: string; // legacy
  percent?: boolean;
  currency?: boolean;
};

const KPIBase: React.FC<KPIProps> = ({ label, value, testid, percent, currency, ...rest }) => {
  const dataTestid = rest["data-testid"] ?? testid;
  const { className, ...dom } = rest;
  
  // Format value based on props
  let formattedValue = value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      formattedValue = BLANK;
    } else if (percent) {
      formattedValue = `${value.toLocaleString()}%`;
    } else if (currency) {
      formattedValue = value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  } else if (value === null || value === undefined) {
    formattedValue = BLANK;
  }
  
  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{formattedValue ?? "—"}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);