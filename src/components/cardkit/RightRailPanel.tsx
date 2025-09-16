import * as React from "react";
const RRPBase: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <aside className={`right-rail w-[320px] shrink-0 ${className ?? ""}`} {...props} />
);
export default RRPBase;
export const RightRailPanel = RRPBase;