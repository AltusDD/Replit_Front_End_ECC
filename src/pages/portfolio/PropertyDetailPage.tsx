import React from "react";
import { useRoute } from "wouter";
import "../../styles/layout-utils.css";

export default function PropertyDetailPage() {
  const [, params] = useRoute("/portfolio/properties/:id");
  const id = params?.id || "";
  return (
    <div className="page-fill" data-testid="property-detail">
      <div className="p-4 text-2xl font-semibold">Property {id}</div>
      <div className="fill-scroll p-4 text-zinc-300">
        Detail view placeholder for {id}
      </div>
    </div>
  );
}