"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { STYLES, ditherMask, useDotSpotlight } from "./dithered-footer";

/** Sparse at the edges, dense through the middle, so the dots gather behind the wordmark. */
const CENTRE_DITHER = ditherMask(
    [
        [0, "#000"],
        [0.3, "#fff"],
        [0.7, "#fff"],
        [1, "#000"],
    ],
    360,
    200,
);

/** Slightly fuller dots than the footer, so the letters read clearly at header size. */
const BAND_GRID = "radial-gradient(circle, #000 1.05px, transparent 1.45px)";

// Header variant of the footer's dot field: the same drift, grid and spotlight,
// but the dither is centred and the tile follows the band's height.
const BAND_STYLES = `
.dfb { --dfb-h: 150px; height: var(--dfb-h); }
@media (max-width: 640px) { .dfb { --dfb-h: 104px; } }
.dfb .df-field { -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent); mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent); }
.dfb .df-field.df-lit {
  -webkit-mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
  mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
}
.dfb .df-dots {
  -webkit-mask-image: ${BAND_GRID}, ${CENTRE_DITHER};
  mask-image: ${BAND_GRID}, ${CENTRE_DITHER};
  -webkit-mask-size: 4px 4px, 360px 100%;
  mask-size: 4px 4px, 360px 100%;
  -webkit-mask-position: 0 0, left center;
  mask-position: 0 0, left center;
}
.dfb-mark {
  font-size: clamp(56px, 8.4vw, 116px); font-weight: 600; line-height: 1; letter-spacing: -0.055em;
  color: var(--bg, #fff); text-decoration: none; padding: 0 .12em .06em;
}
.dfb-mark:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; border-radius: 12px; }
`;

/**
 * A full-width header band: a drifting, dithered dot field with the name cut
 * out of it in the page colour, centred. The mouse lights up the dots under it.
 */
export function DitheredBand({
    name = "Paradigm",
    href = "/",
    accent = "#1b2333",
    className,
}: {
    name?: string;
    href?: string;
    /** Colour of the dots. */
    accent?: string;
    className?: string;
}) {
    const { field, onMove, onLeave } = useDotSpotlight();
    return (
        <header
            className={cn("dfb relative w-full overflow-hidden bg-background", className)}
            style={{ "--df-accent": accent } as CSSProperties}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
        >
            <style>{STYLES + BAND_STYLES}</style>
            <div ref={field} className="df-field" aria-hidden="true">
                <div className="df-dots" />
            </div>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <Link href={href} className="dfb-mark pointer-events-auto select-none" aria-label={`${name}, home`}>
                    {name}
                </Link>
            </div>
        </header>
    );
}

export default DitheredBand;
