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
  
  // Handle non-finite values
  let displayValue = value;
  if (typeof value === "number" && !isFinite(value)) {
    displayValue = BLANK;
  } else if (value === null || value === undefined) {
    displayValue = BLANK;
  } else if (typeof value === "number") {
    // Format numeric values based on flags
    if (percent) {
      displayValue = `${value.toLocaleString()}%`;
    } else if (currency) {
      displayValue = value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } else {
      displayValue = value.toLocaleString();
    }
  }
  
  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{displayValue ?? BLANK}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);