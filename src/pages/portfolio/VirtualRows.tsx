import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

export function VirtualRows<T>({
  rows,
  rowHeight = 44,
  renderRow,
}: {
  rows: T[];
  rowHeight?: number;
  renderRow: (row: T, index: number) => React.ReactNode;
}) {
  return (
    <div style={{ height: 560 }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={Math.max(120, height)}
            width={width}
            itemCount={rows.length}
            itemSize={rowHeight}
          >
            {({ index, style }: ListChildComponentProps) => (
              <div style={style}>{renderRow(rows[index], index)}</div>
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}