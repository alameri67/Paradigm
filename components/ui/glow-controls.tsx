"use client";

/**
 * Paradigm's buttons in the Glow menu style (components/ui/glow-menu.tsx), for use across the app:
 *
 *   GlowButton    one button or link. On hover or keyboard focus the label flips over in 3D (the old
 *                 face rolls up and away, a copy rolls in from below) and a soft radial glow blooms
 *                 behind it. `active` keeps the glow on, like the menu's selected item.
 *   GlowSegmented a row of choices in the menu's frosted bar. Same props as LiquidGlassNavbar, so
 *                 it drops in where that was: radio (roving focus, arrow keys) or nav (aria-current).
 *
 * The motion variants are the Glow menu's own; the styling lives in app/globals.css (.glow-*).
 */

import * as React from "react";
import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------- The Glow menu's motion, shared ---------- */

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};
const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};
const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};
const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};
const sharedTransition = { type: "spring", stiffness: 100, damping: 20, duration: 0.5 } as const;

/**
 * The glow behind a button: the menu's blue. `closest-side` makes it fade out inside its own box, so when the
 * glow scales up behind a wide button it stays a soft halo instead of showing hard rectangular edges.
 */
export const GLOW = "radial-gradient(closest-side, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)";

/** The flipping face: the label, and a copy that rolls in on hover. The copy is hidden from screen readers. */
function Faces({ children, active, glow = GLOW }: { children: React.ReactNode; active?: boolean; glow?: string }) {
  return (
    <>
      <motion.span className="glow-glow" variants={glowVariants} animate={active ? "hover" : undefined} style={{ background: glow }} aria-hidden="true" />
      <motion.span className="glow-face" variants={itemVariants} transition={sharedTransition} style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}>
        {children}
      </motion.span>
      <motion.span
        className="glow-face glow-back"
        variants={backVariants}
        transition={sharedTransition}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </>
  );
}

/* ---------- GlowButton ---------- */

type Common = {
  children: React.ReactNode;
  /** Keep the glow on: the main action, or the selected one. */
  active?: boolean;
  size?: "md" | "sm";
  /** A round button holding just an icon (give it an aria-label). */
  icon?: boolean;
  className?: string;
};
type AsButton = Common & Omit<React.ComponentProps<typeof motion.button>, keyof Common | "ref"> & { href?: undefined };
type AsLink = Common & { href: string; title?: string; "aria-label"?: string };

const MotionLink = motion.create(Link);

export const GlowButton = React.forwardRef<HTMLButtonElement, AsButton | AsLink>(function GlowButton(props, ref) {
  const { children, active, size = "md", icon, className, ...rest } = props;
  const cls = cn("glow-btn", size === "sm" && "sm", icon && "icon", active && "on", className);
  const motionProps = { initial: "initial", whileHover: "hover", whileFocus: "hover", style: { perspective: "600px" } } as const;
  return (
    <MotionConfig reducedMotion="user">
      {"href" in rest && rest.href !== undefined ? (
        <MotionLink {...(rest as Omit<AsLink, keyof Common>)} className={cls} {...motionProps}>
          <Faces active={active}>{children}</Faces>
        </MotionLink>
      ) : (
        <motion.button ref={ref} type="button" {...(rest as Omit<AsButton, keyof Common>)} className={cls} {...motionProps}>
          <Faces active={active}>{children}</Faces>
        </motion.button>
      )}
    </MotionConfig>
  );
});

/* ---------- GlowSegmented: drops in for LiquidGlassNavbar ---------- */

export interface GlowSegmentedItem {
  label: string;
  /** Inline SVG markup for the icon (as LiquidGlassNavbar took it). */
  icon?: string;
}

export interface GlowSegmentedProps {
  items: GlowSegmentedItem[];
  active: number;
  onChange: (index: number) => void;
  /** "radio": one choice of several (arrow keys move it). "nav": links between views (aria-current). */
  mode?: "nav" | "radio";
  size?: "sm";
  /** Hide the labels behind the icons: always, never, or on narrow screens ("auto"). */
  compact?: "auto" | boolean;
  ariaLabel?: string;
  labelledBy?: string;
  className?: string;
}

export function GlowSegmented({ items, active, onChange, mode = "nav", size, compact, ariaLabel, labelledBy, className }: GlowSegmentedProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const radio = mode === "radio";
  const move = (from: number, step: number) => {
    const next = (from + step + items.length) % items.length;
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={cn("glow-seg", size === "sm" && "sm", compact === true && "compact", compact === "auto" && "compact-auto", className)}
        role={radio ? "radiogroup" : "navigation"}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        initial="initial"
        whileHover="hover"
      >
        <motion.span className="glow-seg-aura" variants={navGlowVariants} aria-hidden="true" />
        {items.map((item, i) => {
          const on = i === active;
          return (
            <motion.button
              key={item.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              className={cn("glow-seg-item", on && "on")}
              role={radio ? "radio" : undefined}
              aria-checked={radio ? on : undefined}
              aria-current={!radio && on ? "page" : undefined}
              tabIndex={radio ? (on ? 0 : -1) : undefined}
              onClick={() => onChange(i)}
              onKeyDown={(e) => {
                if (!radio) return;
                const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                move(i, step);
              }}
              initial="initial"
              whileHover="hover"
              whileFocus="hover"
              style={{ perspective: "600px" }}
            >
              <Faces active={on}>
                {item.icon && <span className="glow-seg-ico" aria-hidden="true" dangerouslySetInnerHTML={{ __html: item.icon }} />}
                <span className="glow-seg-label">{item.label}</span>
              </Faces>
            </motion.button>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}
