import { ReactNode } from "react";

export function KPIRow({ children, ...props }: { children: ReactNode; [key: string]: any }) {
  return <div className="grid grid-cols-4 gap-4" {...props}>{children}</div>;
}