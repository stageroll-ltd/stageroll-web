// Line icons, drawn here so nothing loads. 24-unit grid, stroked by CSS.
const paths = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  camera: '<path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.9-3.6 3.4-5.6 6.2-5.6s5.3 2 6.2 5.6"/><circle cx="17" cy="9" r="2.7"/><path d="M17 14.2c2.3 0 3.9 1.6 4.6 4.4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17.5h2"/>',
  pin: '<path d="M7.5 3.5h9"/><path d="M9.5 3.5v5.5l-3 3.5V14h11v-1.5l-3-3.5V3.5"/><path d="M12 14v6.5"/>',
  wifi: '<path d="M2.5 9.5a14 14 0 0 1 19 0"/><path d="M6 13a9 9 0 0 1 12 0"/><path d="M9.5 16.5a4 4 0 0 1 5 0"/><path d="M12 20h.01"/><path d="M4 4l16 16"/>',
  tag: '<path d="M3.5 12.5V4.5h8l8.5 8.5-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  qr: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><rect x="9" y="9" width="6" height="6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  clock: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4h4"/><path d="M12 8v4.5l3 1.8"/>',
  userplus: '<circle cx="10" cy="8" r="3.5"/><path d="M3 20c1-4 4-6 7-6s6 2 7 6"/><path d="M19 7.5v6M16 10.5h6"/>',
  layers: '<path d="M12 3.5l9 5-9 5-9-5z"/><path d="M3 13.5l9 5 9-5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
  doc: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path d="M9 12h6M9 15.5h6"/>',
  check: '<path d="M4.5 12.5l4.5 4.5L19.5 7"/>',
  box: '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 11.5l8.5-4"/><path d="M12 11.5v9"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A9.6 9.6 0 0 1 12 5c5 0 8.5 4.5 9.5 7a12 12 0 0 1-2.6 3.7"/><path d="M6.6 6.6C4.4 8 3 10.3 2.5 12c1 2.5 4.5 7 9.5 7a9.4 9.4 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  clapper: '<path d="M3.5 9.5h17v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/><path d="M3.5 9.5L3 6.6l15.8-2.8.5 2.9z"/><path d="M7.6 5.8l2 2.6M12.6 4.9l2 2.6"/>',
  shield: '<path d="M12 3.5l7.5 3v5.5c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6.5z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  share: '<path d="M12 3.5v11"/><path d="M8 7.5l4-4 4 4"/><path d="M7.5 10.5h-2v10h13v-10h-2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths[name] }} />
  )
}
