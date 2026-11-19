/** Small number and colour helpers for PxBars. Written for this project: the supplied component imports them. */

/** An RGB colour, each channel 0–255. */
export type Rgb = readonly [number, number, number];

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** `a` blended towards `b` by `t` (0 = all `a`, 1 = all `b`). */
export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const k = clamp(t, 0, 1);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

/** A colour as a CSS string, for canvas fill styles. */
export function rgba(color: Rgb, alpha = 1) {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

/** Any CSS colour (hex, rgb(), a name) as RGB, or `fallback` when it can't be read. */
export function parseColor(css: string, fallback: Rgb): Rgb {
  const value = css.trim();
  if (!value) return fallback;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(value);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  // Anything else (a name, color-mix(), oklch()): let a canvas turn it into rgb().
  if (typeof document === "undefined") return fallback;
  const g = document.createElement("canvas").getContext("2d");
  if (!g) return fallback;
  g.fillStyle = "#000";
  g.fillStyle = value;
  const normal = String(g.fillStyle);
  return normal === value ? fallback : parseColor(normal, fallback);
}
