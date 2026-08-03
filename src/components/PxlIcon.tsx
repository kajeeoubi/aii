"use client";

import { useState, useEffect } from "react";

export interface PxlKitFrame {
  grid: string[];
}

export interface PxlKitIconData {
  size: number;
  grid?: string[];
  frames?: PxlKitFrame[];
  palette: Record<string, string>;
  frameDuration?: number;
}

export function PxlIcon({ icon, className = "h-6 w-6" }: { icon: PxlKitIconData; className?: string }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const frames = icon?.frames;
  const frameDuration = icon?.frameDuration || 200;

  useEffect(() => {
    if (!frames || frames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, frameDuration);
    return () => clearInterval(interval);
  }, [frames, frameDuration]);

  if (!icon) return null;

  const grid = icon.grid || (frames && frames[currentFrameIndex] ? frames[currentFrameIndex].grid : null);
  const palette = icon.palette;
  const size = icon.size || 16;

  if (!grid || !palette) return null;

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
