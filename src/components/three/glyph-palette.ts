/**
 * Shared by the two character fields - the hero backdrop and the 404 - so they
 * draw from the same glyph set and the same quantised brand gradient.
 */

export const GLYPHS = "ALEXISFERON/\\|—+·:";

type Rgb = readonly [number, number, number];

export const NAVY: Rgb = [26, 50, 99];
export const SKY: Rgb = [144, 165, 207];
export const AMBER: Rgb = [234, 156, 67];

/**
 * Colour and opacity are quantised so every `fillStyle` string can be built
 * once up front. Composing them per cell instead meant thousands of throwaway
 * strings every frame, which cost more than the drawing did.
 */
export const HUES = 24;
export const ALPHAS = 16;

function mix(a: Rgb, b: Rgb, t: number) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/**
 * Every `fillStyle` for a three-stop gradient, indexed `hue * ALPHAS + alpha`.
 * The stops default to the brand gradient.
 */
export function buildPalette(from: Rgb = NAVY, via: Rgb = SKY, to: Rgb = AMBER) {
  const palette: string[] = [];
  for (let hue = 0; hue < HUES; hue++) {
    const t = hue / (HUES - 1);
    const [r, g, b] = t < 0.5 ? mix(from, via, t * 2) : mix(via, to, (t - 0.5) * 2);
    for (let alpha = 0; alpha < ALPHAS; alpha++) {
      palette[hue * ALPHAS + alpha] =
        `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(alpha / (ALPHAS - 1)).toFixed(3)})`;
    }
  }
  return palette;
}
