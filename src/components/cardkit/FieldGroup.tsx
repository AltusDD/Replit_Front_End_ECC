import * as React from "react";
type FGProps = { label: string; value?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>;
const FGBase: React.FC<FGProps> = ({ label, value, className, ...rest }) => (
  <div className={`field-group flex gap-2 py-1 ${className ?? ""}`} {...rest}>
    <div className="text-xs opacity-70 w-40">{label}</div>
    <div className="text-sm">{value ?? "—"}</div>
  </div>
);
export default FGBase;
export const FieldGroup = FGBase;