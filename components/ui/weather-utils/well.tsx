import * as React from "react";

// Paradigm: a minimal stand-in for the weather card's missing Well. An inset rounded panel that holds layers.
export interface WellProps extends React.HTMLAttributes<HTMLElement> {
  /** field: the sky's sunken panel. */
  variant?: "field" | "plain";
}

export const Well = React.forwardRef<HTMLElement, WellProps>(function Well({ variant = "field", className, ...props }, ref) {
  const own = `wx-well wx-well-${variant} relative`;
  return <div ref={ref as React.Ref<HTMLDivElement>} className={className ? `${own} ${className}` : own} {...props} />;
});
