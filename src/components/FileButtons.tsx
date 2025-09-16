import React from "react";

export default function FileButtons({
  onDoorloop, onDropbox, onUpload
}: {
  onDoorloop?: () => void;
  onDropbox?: () => void;
  onUpload?: () => void;
}) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
      <button className="ecc-object" style={{ padding:"8px 12px" }} onClick={onDoorloop ?? (()=>alert("Stub: DoorLoop Files"))}>DoorLoop</button>
      <button className="ecc-object" style={{ padding:"8px 12px" }} onClick={onDropbox ?? (()=>alert("Stub: Dropbox Folder"))}>Dropbox</button>
      <button className="ecc-object" style={{ padding:"8px 12px" }} onClick={onUpload ?? (()=>alert("Stub: Upload"))}>Upload</button>
    </div>
  );
}