import * as React from "react";
import { BLANK, formatNumber, formatPercent, formatCurrencyFromCents } from "@/lib/format";

type KPIProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: React.ReactNode;
  "data-testid"?: string;
  testid?: string; // legacy
  currency?: boolean;
  percent?: boolean;
};

const KPIBase: React.FC<KPIProps> = ({ label, value, testid, currency, percent, ...rest }) => {
  const dataTestid = rest["data-testid"] ?? testid;
  const { className, ...dom } = rest;
  
  // Format value based on props
  let displayValue: React.ReactNode = value;
  if (value !== null && value !== undefined) {
    if (currency && typeof value === "number") {
      displayValue = isFinite(value) ? formatCurrencyFromCents(value * 100) : BLANK;
    } else if (percent && typeof value === "number") {
      displayValue = isFinite(value) ? formatPercent(value) : BLANK;
    } else if (typeof value === "number" && !isFinite(value)) {
      displayValue = BLANK;
    }
  }
  
  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{displayValue ?? "—"}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);