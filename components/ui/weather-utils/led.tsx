// Paradigm: a minimal stand-in for the weather card's missing Led. A small status dot, green when live.
export function Led({ kind = "live", className }: { kind?: "live" | "off"; className?: string }) {
  const own = `wx-led wx-led-${kind}`;
  return <span aria-hidden className={className ? `${own} ${className}` : own} />;
}
