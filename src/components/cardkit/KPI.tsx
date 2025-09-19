import * as React from "react";
import { BLANK, formatPercent, formatNumber } from "@/lib/format";

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

  // Format the value based on flags
  let formattedValue: React.ReactNode = value;
  
  if (value !== null && value !== undefined && typeof value === "number") {
    if (!Number.isFinite(value)) {
      formattedValue = BLANK;
    } else if (percent) {
      // Render as percentage (value is expected to be a fraction like 0.555)
      formattedValue = formatPercent(value, 1, "fraction");
    } else if (currency) {
      // Render as formatted number with commas (the test expects "1,250" pattern)
      formattedValue = formatNumber(value, 0);
    }
  } else if (value === null || value === undefined || 
             (typeof value === "number" && !Number.isFinite(value))) {
    formattedValue = BLANK;
  }

  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{formattedValue}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);