import React from "react";

export default function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const base: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: variant === "primary" ? "rgba(255,255,255,0.06)" : "transparent",
    cursor: "pointer",
  };
  return (
    <button type="button" onClick={onClick} style={base} className="ecc-object">
      {children}
    </button>
  );
}