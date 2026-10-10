"use client";

/**
 * The 404 artwork: a word rebuilt out of the hero's character field. The text
 * is rasterised once, sampled on a grid, and every inked cell becomes a glyph
 * on a spring - the pointer pushes them aside, a click blows the word apart,
 * and they always find their way home.
 *
 * Layout belongs to CSS, not to this file: the canvas copies the font, size and
 * box of a real DOM element (`targetRef`), so the word is sized and placed by the
 * stylesheet like any other heading, and that element doubles as the no-JS
 * fallback the field fades in over.
 *
 * Same budget rules as the hero: typed arrays, no per-frame allocation, no
 * layout reads in the loop, nothing running off-screen or in a hidden tab, and
 * reduced motion gets a single still frame.
 */

import { useEffect, useRef } from "react";

import {
  ALPHAS,
  buildPalette,
  GLYPHS,
  HUES,
  NAVY,
  SKY,
} from "./glyph-palette";

/** Physics runs on a fixed 60Hz step, whatever the display refreshes at. */
const STEP_MS = 1000 / 60;
const SPRING = 0.035;
const DAMPING = 0.88;
/** Peak acceleration the pointer applies right under itself, in px/frame². */
const PUSH = 2.8;
/** How much of the pointer's own motion it drags through the field. */
const WAKE = 0.14;
const BLAST = 58;
/** A field this dense stops reading as type and starts costing frames. */
const MAX_GLYPHS = 3200;

/**
 * The brand gradient was drawn for solid type. Spread over hairline glyphs it
 * loses an end in each theme: on cream the sky and amber wash out, so light
 * mode deepens them (the amber towards the burnt `--highlight`); on ink the
 * navy all but vanishes, so dark mode lifts it. The sweep keeps its direction.
 */
const LIGHT_PALETTE = buildPalette(NAVY, [74, 104, 170], [190, 105, 18]);
const DARK_PALETTE = buildPalette([92, 118, 176], SKY);

/** The brand gradient is set at 223° - this is its direction on screen. */
const SWEEP_X = Math.sin((223 * Math.PI) / 180);
const SWEEP_Y = -Math.cos((223 * Math.PI) / 180);

type GlyphTextProps = {
  text: string;
  /** The element whose font and box the field reproduces. */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Fires once the field has drawn its first frame. */
  onReady?: () => void;
  className?: string;
};

export function GlyphText({
  text,
  targetRef,
  onReady,
  className,
}: GlyphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The callback changes identity on every parent render; the effect must not.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = targetRef.current;
    const area = canvas?.parentElement;
    if (!canvas || !source || !area) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let palette = root.classList.contains("dark") ? DARK_PALETTE : LIGHT_PALETTE;

    let width = 0;
    let height = 0;
    let count = 0;
    let homeX = new Float32Array(0);
    let homeY = new Float32Array(0);
    let posX = new Float32Array(0);
    let posY = new Float32Array(0);
    let velX = new Float32Array(0);
    let velY = new Float32Array(0);
    /** Position along the brand gradient, 0 (navy) to 1 (amber). */
    let tone = new Float32Array(0);
    /** When each glyph starts heading home during the intro, in seconds. */
    let delay = new Float32Array(0);
    let seed = new Uint16Array(0);

    /** The word's box, in canvas space - blasts and glitches aim at it. */
    const word = { x: 0, y: 0, w: 0, h: 0 };
    let reach = 120;
    let built = false;

    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false };

    /* ---------------------------------------------------------------------
       Build: rasterise the word, sample it, lay the glyphs out
       --------------------------------------------------------------------- */
    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const box = source.getBoundingClientRect();
      if (rect.width === 0 || box.width === 0) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const style = getComputedStyle(source);
      const fontSize = parseFloat(style.fontSize);
      word.x = box.left - rect.left;
      word.y = box.top - rect.top;
      word.w = box.width;
      word.h = box.height;
      reach = Math.min(170, Math.max(70, fontSize * 0.32));

      // Rasterised at 1x: the samples land on a grid far coarser than a pixel.
      const off = document.createElement("canvas");
      off.width = Math.ceil(width);
      off.height = Math.ceil(height);
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return false;
      octx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      if ("letterSpacing" in octx && style.letterSpacing !== "normal") {
        octx.letterSpacing = style.letterSpacing;
      }
      // CSS centres the font's content area inside the line box; doing the
      // same here puts the baseline exactly where the DOM text has it.
      const metrics = octx.measureText(text);
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      const baseline = word.y + (word.h - (ascent + descent)) / 2 + ascent;
      octx.textBaseline = "alphabetic";
      octx.fillStyle = "#000";
      octx.fillText(text, word.x, baseline);

      const pixels = octx.getImageData(0, 0, off.width, off.height).data;
      const x0 = Math.max(0, Math.floor(word.x));
      const x1 = Math.min(off.width, Math.ceil(word.x + word.w));
      const y0 = Math.max(0, Math.floor(word.y));
      const y1 = Math.min(off.height, Math.ceil(word.y + word.h));

      const inked = (step: number) => {
        const points: number[] = [];
        for (let y = y0 + step / 2; y < y1; y += step) {
          for (let x = x0 + step / 2; x < x1; x += step) {
            if (pixels[((y | 0) * off.width + (x | 0)) * 4 + 3] > 128) {
              points.push(x, y);
            }
          }
        }
        return points;
      };

      let step = Math.min(10, Math.max(4, Math.round(fontSize / 55)));
      let points = inked(step);
      while (points.length / 2 > MAX_GLYPHS) points = inked(++step);

      const firstBuild = !built;
      count = points.length / 2;
      homeX = new Float32Array(count);
      homeY = new Float32Array(count);
      posX = new Float32Array(count);
      posY = new Float32Array(count);
      velX = new Float32Array(count);
      velY = new Float32Array(count);
      tone = new Float32Array(count);
      delay = new Float32Array(count);
      seed = new Uint16Array(count);

      const cx = word.x + word.w / 2;
      const cy = word.y + word.h / 2;
      const extent = Math.abs(word.w * SWEEP_X) + Math.abs(word.h * SWEEP_Y);
      const intro = firstBuild && !reduced.matches;

      for (let i = 0; i < count; i++) {
        const x = points[i * 2];
        const y = points[i * 2 + 1];
        homeX[i] = x;
        homeY[i] = y;
        const t = ((x - cx) * SWEEP_X + (y - cy) * SWEEP_Y) / extent + 0.5;
        tone[i] = Math.min(1, Math.max(0, t));
        seed[i] = (Math.random() * 997) | 0;
        // The intro scatters the glyphs over the whole area and calls them in
        // along the gradient, so the word assembles in the brand's own sweep.
        // A rebuild after a resize just snaps them home.
        posX[i] = intro ? Math.random() * width : x;
        posY[i] = intro ? Math.random() * height : y;
        delay[i] = intro ? 0.15 + tone[i] * 0.55 + Math.random() * 0.25 : 0;
      }

      // Glyphs slightly overlap their cell so the word reads as filled, and
      // never shrink below legibility on a small screen.
      const glyphSize = Math.max(7, Math.round(step * 1.3));
      ctx.font = `700 ${glyphSize}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      built = true;
      return true;
    };

    /* ---------------------------------------------------------------------
       Simulation
       --------------------------------------------------------------------- */
    const start = performance.now();
    /** Clock of the last blast - springs go soft for a beat after one. */
    let blastAt = -10;
    let nextGlitch = 2.5;

    const blast = (bx: number, by: number) => {
      blastAt = (performance.now() - start) / 1000;
      for (let i = 0; i < count; i++) {
        const dx = posX[i] - bx;
        const dy = posY[i] - by;
        const d = Math.sqrt(dx * dx + dy * dy) + 1;
        const power =
          BLAST * (0.35 + 0.65 * Math.exp(-d / 360)) * (0.6 + Math.random() * 0.7);
        velX[i] += (dx / d) * power + (Math.random() - 0.5) * 6;
        velY[i] += (dy / d) * power + (Math.random() - 0.5) * 6 - Math.random() * 4;
      }
    };

    /** A horizontal band of the word slips sideways - a dropped scanline. */
    const glitch = () => {
      const band = word.y + Math.random() * word.h;
      const half = (0.02 + Math.random() * 0.06) * word.h;
      const shove = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 10);
      for (let i = 0; i < count; i++) {
        if (Math.abs(homeY[i] - band) < half) velX[i] += shove;
      }
    };

    const simulate = (t: number) => {
      if (t > nextGlitch) {
        glitch();
        nextGlitch = t + 2.2 + Math.random() * 3.5;
      }

      // After a blast the springs ramp back in, so the word drifts together
      // instead of snapping shut.
      const recovery = Math.min(1, 0.12 + (t - blastAt) / 1.4);
      const reach2 = reach * reach;
      const { x: px, y: py, vx: pvx, vy: pvy, active } = pointer;

      for (let i = 0; i < count; i++) {
        let k = SPRING * recovery;
        const since = t - delay[i];
        if (since < 0.6) k *= since < 0 ? 0 : since / 0.6;

        // The resting word breathes: a slow wave rolls through it.
        const restY = homeY[i] + Math.sin(t * 1.6 + homeX[i] * 0.018) * 0.7;
        let ax = (homeX[i] - posX[i]) * k;
        let ay = (restY - posY[i]) * k;

        if (active) {
          const dx = posX[i] - px;
          const dy = posY[i] - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const fall = 1 - d / reach;
            const force = fall * fall * PUSH;
            ax += (dx / d) * force + pvx * fall * WAKE;
            ay += (dy / d) * force + pvy * fall * WAKE;
          }
        }

        velX[i] = (velX[i] + ax) * DAMPING;
        velY[i] = (velY[i] + ay) * DAMPING;
        posX[i] += velX[i];
        posY[i] += velY[i];
      }

      pointer.vx *= 0.8;
      pointer.vy *= 0.8;
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const length = GLYPHS.length;

      for (let i = 0; i < count; i++) {
        const dx = posX[i] - homeX[i];
        const dy = posY[i] - homeY[i];
        const away = Math.min(1, (Math.abs(dx) + Math.abs(dy)) / 160);
        const speed = Math.abs(velX[i]) + Math.abs(velY[i]);

        // Characters tick over slowly at rest and churn while they fly.
        const glyph = (seed[i] + Math.floor(t * (0.5 + speed * 0.9))) % length;
        // A glyph knocked loose warms up towards amber, and dims a touch.
        const hue = Math.min(1, tone[i] + away * 0.45) * (HUES - 1);
        const shimmer = 0.82 + 0.18 * Math.sin(t * 2.2 + seed[i]);
        const alpha = shimmer * (1 - away * 0.35) * (ALPHAS - 1);

        ctx.fillStyle = palette[(hue | 0) * ALPHAS + ((alpha + 0.5) | 0)];
        ctx.fillText(GLYPHS[glyph], posX[i], posY[i]);
      }
    };

    /* ---------------------------------------------------------------------
       Scheduling
       --------------------------------------------------------------------- */
    let raf = 0;
    let last = 0;
    let lag = 0;
    let running = false;
    let onScreen = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // A long gap (tab switch, jank) is dropped rather than replayed.
      lag = Math.min(lag + now - last, STEP_MS * 4);
      last = now;
      const t = (now - start) / 1000;
      while (lag >= STEP_MS) {
        simulate(t);
        lag -= STEP_MS;
      }
      render(t);
    };

    const still = () => {
      // Reduced motion: the finished word, drawn once.
      for (let i = 0; i < count; i++) {
        posX[i] = homeX[i];
        posY[i] = homeY[i];
      }
      render(0);
    };

    const sync = () => {
      if (!built) return;
      const visible = onScreen && !document.hidden;
      if (visible && !reduced.matches) {
        if (running) return;
        running = true;
        last = performance.now();
        lag = 0;
        raf = requestAnimationFrame(loop);
        return;
      }
      if (running) {
        cancelAnimationFrame(raf);
        running = false;
      }
      if (reduced.matches) still();
    };

    /* ---------------------------------------------------------------------
       Input
       --------------------------------------------------------------------- */
    const toCanvas = (event: PointerEvent) => {
      // The canvas can be scrolled under the pointer, so its box is read here,
      // only while the pointer moves - never in the loop.
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event: PointerEvent) => {
      const { x, y } = toCanvas(event);
      if (pointer.active) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };

    // The pointer stops pushing once it leaves the window - or, for a finger
    // or a pen, as soon as it lifts.
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) pointer.active = false;
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.active = false;
    };

    const onDown = (event: PointerEvent) => {
      if (reduced.matches || event.button !== 0) return;
      // Links and buttons keep their click to themselves.
      if ((event.target as Element).closest("a, button, input, textarea")) return;
      const { x, y } = toCanvas(event);
      blast(x, y);
    };

    /* ---------------------------------------------------------------------
       Lifecycle
       --------------------------------------------------------------------- */
    let cancelled = false;
    let resizeFrame = 0;

    const rebuild = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!build()) return;
        if (!running) sync();
      });
    };

    // The word is rasterised from the display face, so it has to be loaded
    // first - sampling the fallback would build the wrong shape.
    const style = getComputedStyle(source);
    document.fonts
      .load(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, text)
      .catch(() => undefined)
      .then(() => {
        if (cancelled || !build()) return;
        sizing.observe(canvas);
        sync();
        onReadyRef.current?.();
      });

    const sizing = new ResizeObserver(() => {
      if (built) rebuild();
    });

    const visibility = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const theme = new MutationObserver(() => {
      palette = root.classList.contains("dark") ? DARK_PALETTE : LIGHT_PALETTE;
      if (!running && built) sync();
    });
    theme.observe(root, { attributes: true, attributeFilter: ["class"] });

    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    area.addEventListener("pointerdown", onDown);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeFrame);
      sizing.disconnect();
      visibility.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerup", onUp);
      area.removeEventListener("pointerdown", onDown);
    };
  }, [text, targetRef]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
