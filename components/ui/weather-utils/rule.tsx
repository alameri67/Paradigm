// Paradigm: a minimal stand-in for the weather card's missing Rule. A 1px hairline.
export function Rule({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  const own = `wx-rule wx-rule-${orientation}`;
  return <hr aria-hidden className={className ? `${own} ${className}` : own} />;
}
