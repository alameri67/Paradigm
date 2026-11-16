"use client";

import { useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode } from "react";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { label: string; href: string; icon: ReactNode };

export type DitheredFooterProps = {
    brand?: string;
    /** Where the wordmark links to. */
    brandHref?: string;
    tagline?: string;
    columns?: FooterColumn[];
    socials?: FooterSocial[];
    legal?: FooterLink[];
    copyright?: string;
    /** Link to your real status page, shown with a green dot. Off unless you pass one. */
    status?: FooterLink | null;
    /** Colour of the dot field. It is the footer's only colour, so it carries the brand. */
    accent?: string;
    /** Called with the email address. Resolve to show the success message. */
    onSubscribe?: (email: string) => void | Promise<void>;
};

/**
 * Stochastic dither: vertical noise thresholded to on/off in one inline SVG
 * filter. `stops` shape the density from top (0) to bottom (1): black is
 * sparse, white is dense. Used as a mask, so the dots take the accent colour.
 * The SVG has no viewBox, so the noise never stretches when the tile height
 * changes; only the gradient follows the tile.
 */
export function ditherMask(stops: [offset: number, color: string][], width = 360, height = 240): string {
    const gradient = stops.map(([o, c]) => `<stop offset='${o}' stop-color='${c}'/>`).join("");
    const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><defs>` +
        `<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>${gradient}</linearGradient>` +
        `<filter id='f' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
        `<feTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' seed='7' stitchTiles='stitch' result='n'/>` +
        `<feColorMatrix in='n' type='matrix' values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1' result='ng'/>` +
        `<feComposite in='SourceGraphic' in2='ng' operator='arithmetic' k2='0.5' k3='0.5' result='s'/>` +
        `<feComponentTransfer in='s' result='t'><feFuncR type='discrete' tableValues='0 1'/></feComponentTransfer>` +
        `<feColorMatrix in='t' type='matrix' values='0 0 0 0 1 0 0 0 0 0.5 0 0 0 0 0 1 0 0 0 0'/>` +
        `</filter></defs><rect width='100%' height='100%' fill='url(#g)' filter='url(#f)'/></svg>`;
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
    return `url('data:image/svg+xml,${encoded}')`;
}

/** Sparse at the top, dense at the bottom (the footer's original field). */
export const DITHER = ditherMask([
    [0.04, "#000"],
    [0.96, "#fff"],
]);

export const GRID = "radial-gradient(circle, #000 0.9px, transparent 1.3px)";

// Scoped by the df- prefix. Masks and motion live here rather than in utility
// classes, so the component renders the same on Tailwind v3 and v4.
export const STYLES = `
.df-field { position: absolute; inset: 0; }
.df-field.df-lit {
  -webkit-mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
  mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
}
.df-dots {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: calc(100% + 360px);
  background: var(--df-accent);
  -webkit-mask-image: ${GRID}, ${DITHER};
  mask-image: ${GRID}, ${DITHER};
  -webkit-mask-size: 4px 4px, 360px 240px;
  mask-size: 4px 4px, 360px 240px;
  -webkit-mask-repeat: repeat, repeat-x;
  mask-repeat: repeat, repeat-x;
  -webkit-mask-position: 0 0, left bottom;
  mask-position: 0 0, left bottom;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
@media (prefers-reduced-motion: no-preference) {
  .df-dots { animation: df-drift 40s linear infinite; }
  @supports (animation-timeline: view()) {
    .df-band { view-timeline: --df-band; }
    .df-mark { animation: df-rise linear both; animation-timeline: --df-band; animation-range: entry 20% entry 100%; }
  }
}
@keyframes df-drift { to { translate: -360px 0; } }
@keyframes df-rise { from { translate: 0 30%; } }
`;

/**
 * Mouse-only spotlight: the pointer position is written to --df-x/--df-y on
 * the field once per frame, and the field is lit while the mouse is over it.
 */
export function useDotSpotlight<T extends HTMLElement = HTMLDivElement>() {
    const field = useRef<T>(null);
    const frame = useRef(0);
    const onMove = (e: PointerEvent<HTMLElement>) => {
        if (e.pointerType !== "mouse") return;
        const el = field.current;
        if (!el) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            el.style.setProperty("--df-x", `${x}px`);
            el.style.setProperty("--df-y", `${y}px`);
            el.classList.add("df-lit");
        });
    };
    const onLeave = () => {
        cancelAnimationFrame(frame.current);
        field.current?.classList.remove("df-lit");
    };
    return { field, onMove, onLeave };
}

const toLinks = (labels: string[]): FooterLink[] =>
    labels.map((label) => ({ label, href: "/" + label.toLowerCase().replace(/\s+/g, "-") }));

const DEFAULT_COLUMNS: FooterColumn[] = [
    { title: "Product", links: toLinks(["Features", "Pricing", "Changelog", "Roadmap"]) },
    { title: "Resources", links: toLinks(["Docs", "Guides", "Community", "Blog"]) },
    { title: "Company", links: toLinks(["About", "Careers", "Contact", "Press"]) },
];

const DEFAULT_LEGAL: FooterLink[] = toLinks(["Privacy", "Terms", "Cookies"]);

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--df-accent)]";
const coarse = "[@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center";

/** A site footer that ends in a drifting, dithered dot field with the wordmark cut out of it. */
export function DitheredFooter({
    brand = "Acme",
    brandHref = "/",
    tagline = "Tools for teams who ship.",
    columns = DEFAULT_COLUMNS,
    socials = [],
    legal = DEFAULT_LEGAL,
    copyright,
    status = null,
    accent = "#4f46e5",
    onSubscribe,
}: DitheredFooterProps) {
    const { field, onMove, onLeave } = useDotSpotlight();
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setState("sending");
        try {
            await onSubscribe?.(email);
            setState("done");
            setEmail("");
        } catch {
            setState("error");
        }
    };

    return (
        <footer
            className="overflow-hidden border-t border-border bg-background text-foreground"
            style={{ "--df-accent": accent } as CSSProperties}
        >
            <style>{STYLES}</style>

            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
                <div className="flex max-w-sm flex-col gap-5">
                    <a href={brandHref} className={`w-fit text-lg font-semibold tracking-tight ${focus}`}>
                        {brand}
                    </a>
                    <p className="text-sm text-fg2">{tagline}</p>
                    <form onSubmit={submit} className="flex flex-col gap-2">
                        <label htmlFor="df-email" className="text-xs font-medium uppercase tracking-wide text-fg2">
                            Get updates
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="df-email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm ${focus}`}
                            />
                            <button
                                type="submit"
                                disabled={state === "sending"}
                                className={`h-10 shrink-0 rounded-md px-4 text-sm font-medium text-background disabled:opacity-60 ${focus}`}
                                style={{ background: "var(--df-accent)" }}
                            >
                                {state === "sending" ? "Sending…" : "Subscribe"}
                            </button>
                        </div>
                        <p aria-live="polite" className="min-h-5 text-xs text-fg2">
                            {state === "done" && "Thanks. You're on the list."}
                            {state === "error" && "That didn't go through. Please try again."}
                        </p>
                    </form>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                    {columns.map((col) => (
                        <div key={col.title} className="flex flex-col gap-3">
                            <h3 className="text-xs font-medium uppercase tracking-wide text-fg2">{col.title}</h3>
                            <ul className="flex flex-col gap-2 text-sm">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <a href={l.href} className={`hover:text-[var(--df-accent)] ${coarse} ${focus}`}>
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div aria-hidden="true" className="df-band relative h-60 overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
                <div ref={field} className="df-field">
                    <div className="df-dots" />
                </div>
                <p className="df-mark pointer-events-none absolute -bottom-[0.05em] left-3 select-none text-[clamp(5rem,21vw,13rem)] font-bold leading-[0.8] tracking-[-0.06em] text-background sm:left-5">
                    {brand}
                </p>
            </div>

            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-xs text-fg2 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span>{copyright ?? `© ${new Date().getFullYear()} ${brand}`}</span>
                    {legal.map((l) => (
                        <a key={l.label} href={l.href} className={`hover:text-foreground ${coarse} ${focus}`}>
                            {l.label}
                        </a>
                    ))}
                    {status && (
                        <a href={status.href} className={`inline-flex items-center gap-1.5 hover:text-foreground ${focus}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                            {status.label}
                        </a>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {socials.map((s) => (
                        <a key={s.label} href={s.href} aria-label={s.label} className={`hover:text-foreground ${coarse} ${focus}`}>
                            {s.icon}
                        </a>
                    ))}
                    <a href="#top" className={`hover:text-foreground ${coarse} ${focus}`}>
                        Back to top ↑
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default DitheredFooter;
