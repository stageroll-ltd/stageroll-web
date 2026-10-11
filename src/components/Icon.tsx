// Line icons, drawn here so nothing loads. 24-unit grid, stroked by CSS.
const paths = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  camera: '<path d="M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.9-3.6 3.4-5.6 6.2-5.6s5.3 2 6.2 5.6"/><circle cx="17" cy="9" r="2.7"/><path d="M17 14.2c2.3 0 3.9 1.6 4.6 4.4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17.5h2"/>',
  pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  tag: '<path d="M3.5 12.5V4.5h8l8.5 8.5-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  qr: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><rect x="9" y="9" width="6" height="6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  clock: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3.5 4v4h4"/><path d="M12 8v4.5l3 1.8"/>',
  userplus: '<circle cx="10" cy="8" r="3.5"/><path d="M3 20c1-4 4-6 7-6s6 2 7 6"/><path d="M19 7.5v6M16 10.5h6"/>',
  sync: '<path d="M4 12a8 8 0 0 1 13.8-5.5L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.8 5.5L4 15.5"/><path d="M4 20v-4.5h4.5"/>',
  layers: '<path d="M12 3.5l9 5-9 5-9-5z"/><path d="M3 13.5l9 5 9-5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths[name] }} />
  )
}
