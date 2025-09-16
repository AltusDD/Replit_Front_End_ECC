import React from "react";

/** Single shimmering line */
export function Line({ w = "100%", h = 12 }: { w?: number | string; h?: number }) {
  return (
    <div
      className="ecc-object"
      style={{
        height: h,
        width: typeof w === "number" ? `${w}px` : w,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
        backgroundSize: "200% 100%",
        animation: "ecc-shimmer 1.2s linear infinite",
        opacity: 0.35,
      }}
    />
  );
}

/** Block placeholder */
export function Block({ h = 96 }: { h?: number }) {
  return <div className="ecc-object" style={{ height: h, opacity: 0.35 }} />;
}