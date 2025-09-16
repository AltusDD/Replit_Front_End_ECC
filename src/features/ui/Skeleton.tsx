import React from "react";

export function Line({ w = "100%" }: { w?: number | string }) {
  return (
    <div
      className="ecc-object"
      style={{
        height: 12,
        width: typeof w === "number" ? `${w}px` : w,
        opacity: 0.3,
        background: "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
        backgroundSize: "200% 100%",
        animation: "ecc-shimmer 1.2s linear infinite",
      }}
    />
  );
}

export function Block({ h = 80 }: { h?: number }) {
  return <div className="ecc-object" style={{ height: h, opacity: 0.3 }} />;
}