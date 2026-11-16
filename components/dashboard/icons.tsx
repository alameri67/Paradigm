/** Line icons for the summary dashboard, drawn like components/simulator/icons.tsx (24px grid, round caps). */
const PATHS = {
  // Card headings
  actions: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  mood: '<circle cx="12" cy="12" r="9.5"/><path d="M8.5 14.5s1.3 1.8 3.5 1.8 3.5-1.8 3.5-1.8"/><path d="M9 9.5h.01"/><path d="M15 9.5h.01"/>',
  jobs: '<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2.5 13h19"/>',
  quote: '<path d="M6 7h4v4c0 3-1.4 5-4 6"/><path d="M14 7h4v4c0 3-1.4 5-4 6"/>',
  chart: '<path d="M3 3v18h18"/><circle cx="8" cy="15" r="1.4"/><circle cx="12.5" cy="10" r="1.4"/><circle cx="17" cy="13" r="1.4"/><circle cx="18" cy="6" r="1.4"/>',
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  // One per action tag
  "keep-going": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  "wait-and-see": '<path d="M6 2.5h12"/><path d="M6 21.5h12"/><path d="M17 21.5v-4a2 2 0 0 0-.6-1.4L12 12l-4.4 4.1a2 2 0 0 0-.6 1.4v4"/><path d="M7 2.5v4a2 2 0 0 0 .6 1.4L12 12l4.4-4.1a2 2 0 0 0 .6-1.4v-4"/>',
  "seek-support": '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  "cut-spending": '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9"/><path d="M14.5 14.5 20 20"/><path d="M8.1 8.1 12 12"/>',
  "save-more": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  "learn-ai": '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15v5"/><path d="M16.5 17.5h5"/>',
  invest: '<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
  politics: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  "collective-action": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  "family-plans": '<circle cx="8.5" cy="6.5" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M2.5 20.5c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14.6 15.6a4 4 0 0 1 6.9 2.9v2"/>',
  "retire-early": '<path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7"/><path d="m8.5 5.5 3.5 3.5 3.5-3.5"/><path d="M4.2 10.2l1.4 1.4"/><path d="M1 18h2"/><path d="M21 18h2"/><path d="M18.4 11.6l1.4-1.4"/><path d="M23 22H1"/>',
  retrain: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
  "change-job": '<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="m10 11.5 3 2.5-3 2.5"/>',
  "side-income": '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/><path d="m16.7 13.9.7.7-2.8 2.8"/>',
  automate: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4H8"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M9 13v2"/><path d="M15 13v2"/>',
  move: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  "sell-or-exit": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  other: '<circle cx="12" cy="12" r="9.5"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/>',
} as const;

export type DashIconName = keyof typeof PATHS;

export const hasDashIcon = (name: string): name is DashIconName => name in PATHS;

export function DashIcon({ name, size = 16, stroke = 1.8 }: { name: DashIconName; size?: number; stroke?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
