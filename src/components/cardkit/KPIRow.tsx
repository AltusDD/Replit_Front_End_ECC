import { ReactNode } from "react";
export function KPIRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-4 gap-4">{children}</div>;
}