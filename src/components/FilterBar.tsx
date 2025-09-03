import React from "react";

type Props = {
  title: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  rightSlot?: React.ReactNode; // optional extra controls
};

export default function FilterBar({ title, placeholder = "Search…", value, onChange, onCreate, createLabel = "Create", rightSlot }: Props) {
  return (
    <div className="ecc-page-head">
      <h1 className="ecc-page-title">{title}</h1>
      <div className="ecc-page-tools">
        <input
          className="ecc-search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {rightSlot}
        {onCreate && (
          <button className="ecc-btn ecc-btn-gold" onClick={onCreate}>{createLabel}</button>
        )}
      </div>
    </div>
  );
}
