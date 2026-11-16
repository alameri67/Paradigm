"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * A small (?) next to a title. Hover, focus or tap it to read the help text.
 * Tap again, tap elsewhere or press Escape to close.
 */
export function HelpTip({ children, label = "What this means" }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <span ref={ref} className={"help-tip" + (open ? " open" : "")}>
      <button type="button" className="help-tip-btn" aria-label={label} aria-expanded={open} aria-describedby={id} onClick={() => setOpen((v) => !v)}>
        ?
      </button>
      <span role="tooltip" id={id} className="help-tip-pop">
        {children}
      </span>
    </span>
  );
}
