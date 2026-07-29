"use client";

/**
 * SCRATCH — hero backdrop candidate: a field of characters rather than pixels.
 * Canvas 2D on purpose, no WebGL: the effect is typographic, and this keeps it
 * off the GPU budget entirely.
 * Delete alongside the lab route once a direction is picked.
 */

import { useEffect, useRef } from "react";

const GLYPHS = "ALEXISFERON/\\|—+·:";
const CELL = 26;
/** 30fps is plenty for a character field and halves the fillText load. */
const FRAME_MS = 1000 / 30;

const NAVY = [26, 50, 99] as const;
const SKY = [144, 165, 207] as const;
const AMBER = [234, 156, 67] as const;

function mix(a: readonly number[], b: readonly number[], t: number) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function brand(t: number) {
  return t < 0.5 ? mix(NAVY, SKY, t * 2) : mix(SKY, AMBER, (t - 0.5) * 2);
}

export function CharGridScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = { x: -999, y: -999 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let dpr = 1;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      cols = Math.ceil(rect.width / CELL);
      rows = Math.ceil(rect.height / CELL);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    let last = 0;
    const start = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < FRAME_MS) return;
      last = now;

      const t = (now - start) / 1000;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `700 ${CELL * 0.62}px var(--font-josefin), monospace`;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL + CELL / 2;
          const y = row * CELL + CELL / 2;

          // Slow diagonal swell, so the field always breathes on its own.
          const wave =
            Math.sin(col * 0.16 + t * 0.5) * Math.cos(row * 0.21 - t * 0.35);
          let intensity = wave * 0.5 + 0.5;

          // The cursor burns a bright hole through it.
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const near = Math.exp(-(dx * dx + dy * dy) / 26000);
          intensity = Math.min(1, intensity * 0.55 + near * 1.1);

          if (intensity < 0.16) continue;

          // Character changes slowly per cell, faster where it is lit.
          const seed = col * 31 + row * 17;
          const index = Math.floor(seed + t * (0.6 + near * 6)) % GLYPHS.length;

          const [r, g, b] = brand(Math.min(1, col / cols + intensity * 0.35));
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(
            intensity * 0.85
          ).toFixed(3)})`;
          ctx.fillText(GLYPHS[index], x, y);
        }
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
}
