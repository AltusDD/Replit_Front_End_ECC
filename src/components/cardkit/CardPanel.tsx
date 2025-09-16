import * as React from "react";
const CardPanelBase: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`card-panel p-4 rounded-xl border border-white/10 ${className ?? ""}`} {...props} />
);
export default CardPanelBase;
export const CardPanel = CardPanelBase;