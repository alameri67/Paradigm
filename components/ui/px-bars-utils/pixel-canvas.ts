"use client";

/**
 * A crisp canvas that sizes itself to its box and redraws on demand. Written for this project:
 * the supplied PxBars imports it.
 *
 * Colours come from CSS custom properties on the canvas, so a page can theme the chart:
 *   --px-foreground (default: the text colour), --px-muted (default: --fg2),
 *   --px-accent (default: --lumesec) and --px-shine (default: --lumesec-shine).
 */
import { useEffect, useMemo, useRef } from "react";
import { parseColor, type Rgb } from "./math";

export interface PixelPalette {
  foreground: Rgb;
  muted: Rgb;
  accent: Rgb;
  shine: Rgb;
}

export interface PixelFrame {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  palette: PixelPalette;
  /** Width and height in CSS pixels. */
  width: number;
  height: number;
  /** Seconds since the page loaded, and since the last frame. */
  time: number;
  delta: number;
  clear: () => void;
  /** A square "pixel" with its top-left corner at x, y. */
  dot: (x: number, y: number, color: Rgb, alpha: number, size: number) => void;
}

/** Draw returns true while something is still moving, to ask for another frame. */
export function usePixelCanvas(draw: (frame: PixelFrame) => boolean | void) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    drawRef.current = draw;
  });

  // One loop for the hook's lifetime: it reads the latest draw from drawRef, so it never needs rebuilding.
  const redraw = useMemo(() => {
    const paint = (timestamp: number) => {
      raf.current = 0;
      const canvas = ref.current;
      const g = canvas?.getContext("2d");
      if (!canvas || !g) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const css = getComputedStyle(canvas);
      const v = (name: string) => css.getPropertyValue(name);
      const foreground = parseColor(v("--px-foreground") || css.color, [13, 13, 13]);
      const palette: PixelPalette = {
        foreground,
        muted: parseColor(v("--px-muted") || v("--fg2"), [93, 93, 93]),
        accent: parseColor(v("--px-accent") || v("--lumesec"), [98, 25, 243]),
        shine: parseColor(v("--px-shine") || v("--lumesec-shine"), [63, 18, 176]),
    };
    const now = timestamp / 1000; // the frame's own clock, from requestAnimationFrame
    const delta = last.current ? Math.min(now - last.current, 0.1) : 1 / 60;
    last.current = now;
    const moving = drawRef.current({
      canvas,
      context: g,
      palette,
      width,
      height,
      time: now,
      delta,
      clear: () => g.clearRect(0, 0, width, height),
      dot: (x, y, color, alpha, size) => {
        g.globalAlpha = Math.max(0, Math.min(1, alpha));
        g.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        g.fillRect(x, y, size, size);
        g.globalAlpha = 1;
      },
    });
    if (moving) raf.current = requestAnimationFrame(paint);
    else last.current = 0;
    };
    /** Ask for a frame (several calls before it runs make one frame). */
    return () => {
      if (!raf.current) raf.current = requestAnimationFrame(paint);
    };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ro = new ResizeObserver(redraw);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [redraw]);

  return { ref, redraw };
}
