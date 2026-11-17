import type { ReactNode } from "react";

/** Text in the data is a list of bullets, or older prose that we split into sentences. */
export type Points = string | readonly string[];

/** "**key words**" in the data shows as bold; everything else stays plain text. */
export function withBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

/** One bullet per point. Prose is split at sentence ends, so older interviews read the same way. */
export function toPoints(text: Points | undefined | null): string[] {
  if (!text) return [];
  if (Array.isArray(text)) return text.map((t) => t.trim()).filter(Boolean);
  return (text as string)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'‘(])/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** A short bullet list, with selective bold from the data. */
export function Bullets({ text, className }: { text: Points | undefined | null; className?: string }) {
  const points = toPoints(text);
  if (!points.length) return null;
  return (
    <ul className={"bullets" + (className ? ` ${className}` : "")}>
      {points.map((p, i) => (
        <li key={i}>{withBold(p)}</li>
      ))}
    </ul>
  );
}
