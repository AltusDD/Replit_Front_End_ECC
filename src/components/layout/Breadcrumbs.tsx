import React from "react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" style={{ 
      padding: "var(--gap-2) 0", 
      fontSize: "var(--fs-14)", 
      color: "var(--text-muted)" 
    }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span style={{ margin: "0 8px" }}>›</span>}
          {item.href ? (
            <Link href={item.href} style={{ color: "var(--link)" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--text)" }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}