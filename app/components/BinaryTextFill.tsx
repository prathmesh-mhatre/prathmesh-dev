"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number; // in px
  color?: string; // digit color
  density?: number; // higher = more digits
};

function BinaryTextFill({
  text,
  fontFamily = "AVGARDD, sans-serif",
  fontWeight = 700,
  fontSize = 160,
  color = "#cfcfcf",
  density = 1.0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [imageHref, setImageHref] = useState<string>("");

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.font = `${typeof fontWeight === "number" ? fontWeight : fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width);
    const height = Math.ceil(fontSize * 1.2);
    setSize({ w: width, h: height });
  }, [text, fontFamily, fontWeight, fontSize]);

  // Render dense digits to offscreen canvas -> data URL for a single SVG <image>
  useEffect(() => {
    const { w, h } = size;
    if (!w || !h) return;
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    const base = 12; // smaller = denser
    const cell = Math.max(5, base / Math.max(0.5, density));
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    ctx.textBaseline = "alphabetic";

    // Use monospace for digits texture
    const monoStack = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitterX = (Math.random() - 0.5) * (cell * 0.5);
        const jitterY = (Math.random() - 0.5) * (cell * 0.5);
        const x = c * cell + jitterX + cell * 0.3;
        const y = r * cell + jitterY + cell * 0.8;
        const s = Math.max(7, cell * (0.85 + Math.random() * 0.6));
        const d = Math.random() > 0.5 ? "1" : "0";
        const o = 0.55 + Math.random() * 0.4;
        ctx.font = `${s}px ${monoStack}`;
        ctx.fillStyle = color;
        ctx.globalAlpha = o;
        ctx.fillText(d, x, y);
      }
    }

    ctx.globalAlpha = 1;
    setImageHref(canvas.toDataURL("image/png"));
  }, [size, density, color]);

  const clipId = useMemo(() => `clip-${Math.random().toString(36).slice(2)}`, []);

  if (!size.w || !size.h) return null;

  return (
    <svg
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden
      role="img"
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <text
            x={0}
            y={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight as number}
            fontSize={fontSize}
            letterSpacing={0}
          >
            {text}
          </text>
        </clipPath>
      </defs>
      {imageHref && (
        <image
          href={imageHref}
          x={0}
          y={0}
          width={size.w}
          height={size.h}
          preserveAspectRatio="none"
          clipPath={`url(#${clipId})`}
        />
      )}
    </svg>
  );
}

export default React.memo(BinaryTextFill);
