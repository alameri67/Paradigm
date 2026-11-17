import * as React from "react";

// Paradigm: a minimal stand-in for the weather card's missing Surface. A raised, rounded slab.
export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** The element to render (default div). */
  as?: "div" | "section" | "article" | "aside";
  /** raise: a white slab lifted off the page. flat: no shadow. */
  material?: "raise" | "flat";
  /** card: the card radius. panel: a smaller one. */
  radius?: "card" | "panel";
}

export const Surface = React.forwardRef<HTMLElement, SurfaceProps>(function Surface(
  { as: Tag = "div", material = "raise", radius = "card", className, ...props },
  ref,
) {
  const own = `wx-surface wx-surface-${material} wx-radius-${radius}`;
  return React.createElement(Tag, { ref, className: className ? `${own} ${className}` : own, ...props });
});
