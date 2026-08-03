export interface PxlKitIconData {
  size: number;
  grid: string[];
  palette: Record<string, string>;
}

export function PxlIcon({ icon, className = "h-6 w-6" }: { icon: PxlKitIconData; className?: string }) {
  if (!icon || !icon.grid) return null;
  const { grid, palette, size } = icon;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {grid.map((row, y) =>
        row.split("").map((char, x) => {
          const color = palette[char];
          if (!color || char === ".") return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        })
      )}
    </svg>
  );
}
