import * as React from "react";
import { BLANK } from "@/lib/format";

type KPIProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: React.ReactNode;
  "data-testid"?: string;
  testid?: string; // legacy
  currency?: boolean; // format as currency
  percent?: boolean; // format as percentage
};

const KPIBase: React.FC<KPIProps> = ({ label, value, testid, currency, percent, ...rest }) => {
  const dataTestid = rest["data-testid"] ?? testid;
  const { className, ...dom } = rest;
  
  // Handle finite value checking and formatting
  let displayValue: React.ReactNode = value;
  if (typeof value === "number") {
    if (!isFinite(value)) {
      displayValue = BLANK;
    } else if (currency) {
      displayValue = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    } else if (percent) {
      displayValue = `${Math.round(value * 100)}%`;
    }
  } else if (value === undefined || value === null) {
    displayValue = BLANK;
  }
  
  return (
    <div className={`kpi ${className ?? ""}`} {...dom} data-testid={dataTestid}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{displayValue}</div>
    </div>
  );
};

export default KPIBase;
export const KPI = KPIBase;
export const KPIRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`kpi-row grid grid-cols-4 gap-4 ${className ?? ""}`} {...props} />
);