import type { ReactNode } from 'react'

import { drawings } from './drawings'
import { featurePages, type FeaturePage } from './features'
import type { Item, Show } from './Showcase'

// Every feature page, told in ruled bands (Showcase.tsx), by slug. Each
// band's words are the feature page's own (features.ts): its steps as a
// list, without numbers, and its features as cells. Each page opens on a
// line drawing of its own subject, in ink and the sunset's colours
// (drawings.ts); the pages differ too in which bands they have and their
// order.

const page = (slug: string): FeaturePage => {
  const found = featurePages.find((p) => p.slug === slug)
  if (!found) throw new Error(`No feature page for ${slug}`)
  return found
}

/** A page's steps as list items, each with an icon in place of its number. */
const steps = (slug: string, icons: Item[2][]): Item[] =>
  (page(slug).steps ?? []).map(([lead, text], i): Item => [lead, text, icons[i]])

const features = (slug: string): Item[] => page(slug).features

/** Fine rings in the sunset's colours, with something drawn in ink at their middle (about 48 square, round 160, 100). */
export function Rings({ children }: { children?: ReactNode }) {
  return (
    <svg className="sec-rings" viewBox="0 0 320 200" aria-hidden="true">
      <ellipse className="deep" cx="160" cy="100" rx="150" ry="56" />
      <ellipse className="mid" cx="160" cy="100" rx="118" ry="70" />
      <ellipse className="top" cx="160" cy="100" rx="86" ry="84" />
      <ellipse className="glow" cx="160" cy="100" rx="56" ry="92" />
      {children}
    </svg>
  )
}

/** A phone with a script inside it, and a ring the script never crosses. */
export function Kept() {
  return (
    <svg className="sec-kept" viewBox="0 0 360 320" aria-hidden="true">
      <circle className="deep dash" cx="180" cy="160" r="150" />
      <circle className="top" cx="180" cy="160" r="118" />
      <rect className="ink" x="128" y="58" width="104" height="204" rx="20" />
      <path className="ink" d="M168 72h24" />
      <path className="ink" d="M152 110h40l16 16v72h-56z" />
      <path className="ink" d="M192 110v16h16M164 150h32M164 166h32M164 182h20" />
    </svg>
  )
}

/** A script page on the left, its lines running across in the sunset's colours into a list of scenes. */
function PageToScenes() {
  return (
    <svg className="sec-rings wide" viewBox="0 0 420 200" aria-hidden="true">
      <path className="ink" d="M40 24h64l24 24v128H40z" />
      <path className="ink" d="M104 24v24h24M58 76h52M58 94h52M58 112h52M58 130h34" />
      <path className="glow" d="M128 76C200 76 210 48 282 48" />
      <path className="top" d="M128 94C200 94 210 84 282 84" />
      <path className="mid" d="M128 112C200 112 210 120 282 120" />
      <path className="deep" d="M128 130C200 130 210 156 282 156" />
      <rect className="ink" x="282" y="34" width="108" height="28" rx="7" />
      <rect className="ink" x="282" y="70" width="108" height="28" rx="7" />
      <rect className="ink" x="282" y="106" width="108" height="28" rx="7" />
      <rect className="ink" x="282" y="142" width="108" height="28" rx="7" />
    </svg>
  )
}

/** A page's own drawing (drawings.ts). */
export function Draw({ of }: { of: keyof typeof drawings }) {
  return <svg className="sec-rings wide" viewBox="0 0 420 200" aria-hidden="true" dangerouslySetInnerHTML={{ __html: drawings[of] }} />
}

// The padlock at the rings' middle, in ink.
const lock = (
  <>
    <rect className="ink" x="136" y="92" width="48" height="40" rx="7" />
    <path className="ink" d="M146 92V80a14 14 0 0 1 28 0v12M160 108v8" />
  </>
)

export const shows: Record<string, Show> = {
  script: {
    art: <PageToScenes />,
    bands: [
      {
        kind: 'split',
        heading: 'From a file to a scene list',
        items: steps('script', ['doc', 'search', 'merge', 'check', 'history']),
        art: <Kept />,
      },
      { kind: 'grid', heading: 'What it handles', items: features('script') },
    ],
  },

  scenes: {
    art: <Draw of="scenes" />,
    bands: [
      { kind: 'grid', heading: 'What a scene holds', items: features('scenes') },
      { kind: 'list', heading: 'How a scene is worked', items: steps('scenes', ['doc', 'clapper', 'layers', 'check']) },
    ],
  },

  continuity: {
    art: <Draw of="continuity" />,
    bands: [
      { kind: 'grid', heading: 'What it keeps', items: features('continuity') },
      {
        kind: 'list',
        heading: 'How a record is made',
        items: steps('continuity', ['clapper', 'box', 'camera', 'doc', 'check']),
      },
    ],
  },

  research: {
    art: <Draw of="research" />,
    bands: [
      {
        kind: 'list',
        heading: 'From a reference to the real thing',
        items: steps('research', ['plus', 'pin', 'check', 'tag']),
      },
      { kind: 'grid', heading: 'What the research wall does', items: features('research') },
    ],
  },

  inventory: {
    art: <Draw of="inventory" />,
    bands: [
      { kind: 'grid', heading: 'What it keeps track of', items: features('inventory') },
      {
        kind: 'list',
        heading: 'How an item is kept',
        items: steps('inventory', ['plus', 'list', 'folder', 'clapper', 'flag']),
      },
    ],
  },

  scanning: {
    art: <Draw of="scanning" />,
    bands: [
      { kind: 'list', heading: 'How codes work', items: steps('scanning', ['qr', 'camera', 'userplus']) },
      { kind: 'grid', heading: 'What a code can do', items: features('scanning'), cols: 3 },
    ],
  },

  schedule: {
    art: <Draw of="schedule" />,
    bands: [
      {
        kind: 'list',
        heading: 'How the shoot is laid out',
        items: steps('schedule', ['calendar', 'clapper', 'clock', 'phone']),
      },
      { kind: 'grid', heading: 'What the schedule does', items: features('schedule'), cols: 5 },
    ],
  },

  reports: {
    art: <Draw of="reports" />,
    bands: [
      {
        kind: 'list',
        heading: 'From the production to the page',
        items: steps('reports', ['list', 'filter', 'layers', 'eye', 'share']),
      },
      { kind: 'grid', heading: 'Every department’s paperwork', items: features('reports') },
    ],
  },

  team: {
    art: <Draw of="team" />,
    bands: [
      { kind: 'list', heading: 'How a team comes together', items: steps('team', ['crown', 'userplus', 'users']) },
      { kind: 'grid', heading: 'Who is on a production', items: features('team'), cols: 3 },
    ],
  },

  privacy: {
    art: <Rings>{lock}</Rings>,
    bands: [
      {
        kind: 'two',
        heading: 'Our approach',
        text: [
          'Productions hold unreleased scripts and private work. So StageRoll reads the script on your phone, and the file is never uploaded: only the scene list and the cast are kept.',
          'Everything else in a production, its scenes, records and photos, is shown only to the people on it. Your work is never sold, used for advertising or used to train AI.',
        ],
      },
      {
        kind: 'split',
        heading: 'Our principles',
        items: [
          ['On your device', 'The script is read where you are, not on a server.', 'doc'],
          ['Members only', 'A production is shown only to the people on it.', 'users'],
          ['Locked when you leave', 'A PIN or Face ID, and it locks itself when you step away.', 'shield'],
          ['Yours to sign out', 'Every signed-in device is listed, and any of them can be signed out.', 'phone'],
          ['Never sold', 'No advertising, no selling, no training AI on your work.', 'eyeoff'],
        ],
        art: <Kept />,
      },
      { kind: 'grid', heading: 'Our safeguards', items: features('privacy') },
    ],
  },
}
