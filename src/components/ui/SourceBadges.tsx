import React from "react";

type Props = {
  doorloop?: boolean;
  corelogic?: boolean;
  m365?: boolean;
  dropbox?: boolean;
  className?: string;
};

const badge = (label: string, title: string) => (
  <span
    key={label}
    title={title}
    className="px-2 py-0.5 rounded-full text-xs bg-neutral-800 border border-neutral-700 text-neutral-300"
  >
    {label}
  </span>
);

export default function SourceBadges({ doorloop, corelogic, m365, dropbox, className }: Props) {
  const items: React.ReactNode[] = [];
  if (doorloop) items.push(badge("DL", "DoorLoop"));
  if (corelogic) items.push(badge("CL", "CoreLogic"));
  if (m365) items.push(badge("M365", "Microsoft 365 (Teams/SharePoint/Outlook/Planner)"));
  if (dropbox) items.push(badge("DBX", "Dropbox"));
  if (!items.length) return null;
  return <div className={`flex flex-wrap gap-1 ${className || ""}`}>{items}</div>;
}