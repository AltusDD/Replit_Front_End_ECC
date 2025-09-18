import * as React from "react";
import { formatCurrencyFromCents, formatPercent, BLANK } from "@/lib/format";

type KPIProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: React.ReactNode;
  currency?: boolean;
  percent?: boolean;
  "data-testid"?: string;
  testid?: string; // legacy
};

const KPIBase: React.FC<KPIProps> = ({ label, value, currency, percent, testid, ...rest }) => {
  const dataTestid = rest["data-testid"] ?? testid;
  const { className, ...dom } = rest;
  
  // Format value based on props
  let formattedValue = value;
  if (currency && typeof value === "number") {
    // Value is in dollars, convert to cents for formatCurrencyFromCents
    formattedValue = formatCurrencyFromCents(value * 100);
  } else if (percent && typeof value === "number") {
    formattedValue = formatPercent(value);
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