"use client";

/**
 * Hero backdrop: a field of characters rather than pixels. Canvas 2D on
 * purpose, no WebGL - the effect is typographic, and this keeps it off the GPU
 * budget entirely.
 *
 * It is also the single heaviest thing on the page, so it is written to stay
 * out of the way: nothing runs before the page is idle, nothing runs while it
 * is off-screen or the tab is hidden, the draw loop allocates nothing and
 * never touches layout, and reduced-motion gets one static frame.
 */

import { useEffect, useRef } from "react";

const GLYPHS = "ALEXISFERON/\\|—+·:";
const CELL = 26;
/** 30fps is plenty for a character field and halves the fillText load. */
const FRAME_MS = 1000 / 30;
/** Below this a cell is close enough to invisible to skip entirely. */
const CUTOFF = 0.16;
/** Distance in px past which the cursor glow contributes less than 0.001. */
const POINTER_REACH = 440;
/**
 * The field has always been drawn at the canvas default, because the original
 * font string interpolated a CSS custom property - something canvas cannot
 * parse, so the assignment was dropped and the context kept `10px sans-serif`.
 * That small scale is the look we want; it is now stated outright rather than
 * depending on a failed assignment.
 */
const GLYPH_FONT = "10px sans-serif";

const NAVY = [26, 50, 99] as const;
const SKY = [144, 165, 207] as const;
const AMBER = [234, 156, 67] as const;

/**
 * Colour and opacity are quantised so every `fillStyle` string can be built
 * once up front. Composing them per cell instead meant thousands of throwaway
 * strings every frame, which cost more than the drawing did.
 */
const HUES = 24;
const ALPHAS = 16;

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

const PALETTE: string[] = [];
for (let hue = 0; hue < HUES; hue++) {
  const [r, g, b] = brand(hue / (HUES - 1));
  for (let alpha = 0; alpha < ALPHAS; alpha++) {
    PALETTE[hue * ALPHAS + alpha] =
      `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(alpha / (ALPHAS - 1)).toFixed(3)})`;
  }
}

/** Runs the callback when the browser is next idle, or shortly after. */
function whenIdle(run: () => void): () => void {
  const idle = window.requestIdleCallback;
  if (idle) {
    const handle = idle(run, { timeout: 1200 });
    return () => window.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(run, 400);
  return () => window.clearTimeout(handle);
}

export function CharGridScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Cached in `resize` so the draw loop never reads layout back - a
    // getBoundingClientRect() in there forces a reflow on every single frame,
    // right after the parallax has written its transforms.
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let columnWave = new Float64Array(0);

    const pointer = { x: -9999, y: -9999 };

    const applyFont = () => {
      ctx.font = GLYPH_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const onMove = (event: PointerEvent) => {
      // The canvas rides a parallax transform, so its box has to be read here
      // rather than cached - but only while the pointer is actually moving.
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // The swell is separable, so its two halves are evaluated once per column
      // and once per row instead of once per cell.
      for (let col = 0; col < cols; col++) {
        columnWave[col] = Math.sin(col * 0.16 + t * 0.5);
      }

      for (let row = 0; row < rows; row++) {
        const y = row * CELL + CELL / 2;
        const rowWave = Math.cos(row * 0.21 - t * 0.35);
        const dy = y - pointer.y;
        const litRow = dy > -POINTER_REACH && dy < POINTER_REACH;

        for (let col = 0; col < cols; col++) {
          const x = col * CELL + CELL / 2;

          // Slow diagonal swell, so the field always breathes on its own.
          let intensity = columnWave[col] * rowWave * 0.5 + 0.5;

          // The cursor burns a bright hole through it. Past POINTER_REACH the
          // falloff is under a thousandth, so the exp() is simply skipped.
          let near = 0;
          if (litRow) {
            const dx = x - pointer.x;
            if (dx > -POINTER_REACH && dx < POINTER_REACH) {
              near = Math.exp(-(dx * dx + dy * dy) / 26000);
            }
          }
          intensity = Math.min(1, intensity * 0.55 + near * 1.1);

          if (intensity < CUTOFF) continue;

          // Character changes slowly per cell, faster where it is lit.
          const seed = col * 31 + row * 17;
          const index = Math.floor(seed + t * (0.6 + near * 6)) % GLYPHS.length;

          const hue = Math.min(
            HUES - 1,
            ((col / cols + intensity * 0.35) * (HUES - 1)) | 0,
          );
          const alpha = (intensity * 0.85 * (ALPHAS - 1) + 0.5) | 0;

          ctx.fillStyle = PALETTE[hue * ALPHAS + alpha];
          ctx.fillText(GLYPHS[index], x, y);
        }
      }
    };

    /* ---------------------------------------------------------------------
       Scheduling
       --------------------------------------------------------------------- */
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let running = false;
    /** Stays false until the page has gone idle once - see `whenIdle` below. */
    let armed = false;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      render(now);
    };

    const visible = () => onScreen && !document.hidden && width > 0;

    const sync = () => {
      if (armed && visible() && !reduced.matches) {
        if (running) return;
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
        return;
      }

      if (running) {
        cancelAnimationFrame(raf);
        running = false;
      }
      // Reduced motion still deserves the artwork - just not a moving one.
      if (armed && reduced.matches && visible()) render(start);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      if (columnWave.length !== cols) columnWave = new Float64Array(cols);
      // Resizing the backing store resets the whole context state.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyFont();
      // A resize wipes the canvas, so a paused frame has to be redrawn.
      if (!running) sync();
    };

    resize();

    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);

    const visibility = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    window.addEventListener("pointermove", onMove, { passive: true });

    // Nothing starts drawing until the page has finished its own work.
    const cancelIdle = whenIdle(() => {
      armed = true;
      sync();
    });

    return () => {
      cancelIdle();
      cancelAnimationFrame(raf);
      sizing.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
}
