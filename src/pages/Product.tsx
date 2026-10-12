import { useEffect, useRef, useState } from 'react'

import { Icon, type IconName } from '../components/Icon'

// Everything on this page is something the app does, checked against
// stageroll-native, except Sets (stageroll-docs #29), which is stated as a
// department like the others. The copy says what a feature does for a
// department, not how its screen is laid out.

type Point = { icon: IconName; lead: string; text: string }

type Section = {
  id: string
  /** The section's name in the bar of links under the hero. */
  nav: string
  icon: IconName
  eyebrow: string
  heading: string
  lede: string
  points: Point[]
  /** Short facts for the reader who wants the specifics. */
  specs?: [string, string][]
  /** A screenshot from the app, shown in a phone beside the words. */
  shot?: { src: string; alt: string }
}

type Tile = { icon: IconName; heading: string; text: string }

const departments: { name: string; line: string }[] = [
  { name: 'Costume', line: 'Changes and what’s in them' },
  { name: 'Props', line: 'Who carries what, scene by scene' },
  { name: 'Hair', line: 'Styles and their pieces' },
  { name: 'Makeup', line: 'Looks and their pieces' },
  { name: 'Sets', line: 'Every set and how it’s dressed' },
]

const sections: Section[] = [
  {
    id: 'script',
    nav: 'Script',
    icon: 'doc',
    eyebrow: 'Script analysis',
    heading: 'Read in seconds. Approved by you.',
    lede: 'Import the script and StageRoll turns it into the production’s scenes and cast, ready for your department to break down.',
    points: [
      {
        icon: 'list',
        lead: 'Every scene.',
        text: 'Numbers, interior or exterior, location and time of day, as the script has them.',
      },
      {
        icon: 'users',
        lead: 'The cast.',
        text: 'Every speaking part, numbered like a cast list and easy to match to the call sheet.',
      },
      {
        icon: 'layers',
        lead: 'Background too.',
        text: 'Crowds and extras are picked up as background, with head counts where the script gives them.',
      },
      {
        icon: 'check',
        lead: 'You check it first.',
        text: 'Likely misreads and duplicate names are flagged for you, and nothing joins the production until you approve it.',
      },
      {
        icon: 'doc',
        lead: 'New drafts, no rework.',
        text: 'Import the next draft and your work carries over. You’re only asked about what changed.',
      },
    ],
    specs: [
      ['Formats', 'PDF with selectable text, or Final Draft (.fdx). Not scans or password-protected PDFs.'],
      ['Where it’s read', 'On your device. The file itself is never uploaded.'],
      ['Series', 'Each episode has its own drafts and scene numbers.'],
    ],
  },
  {
    id: 'scenes',
    nav: 'Scenes',
    icon: 'clapper',
    eyebrow: 'Scenes',
    heading: 'A page for every scene.',
    lede: 'Photos, notes and the breakdown for every scene, focused on your department.',
    points: [
      {
        icon: 'camera',
        lead: 'Photos and notes.',
        text: 'Each department keeps its own photos and notes for every scene.',
      },
      {
        icon: 'users',
        lead: 'Everyone in it.',
        text: 'Who’s in the scene and what they need from your department, background and head counts included.',
      },
      {
        icon: 'check',
        lead: 'Where it stands.',
        text: 'Track every scene from to do to done, shared with the whole crew.',
      },
      {
        icon: 'clock',
        lead: 'Start before the script.',
        text: 'Add scenes by hand, and match them up when the script arrives.',
      },
    ],
  },
  {
    id: 'continuity',
    nav: 'Continuity',
    icon: 'camera',
    eyebrow: 'Continuity',
    heading: 'Every change, style, look and prop, on record.',
    lede: 'Costume keeps changes, hair keeps styles, makeup keeps looks, props keep what’s carried, and sets keep how each scene is dressed.',
    points: [
      {
        icon: 'tag',
        lead: 'For every character.',
        text: 'Changes, styles and looks are kept per character, each with its photos and notes.',
      },
      {
        icon: 'box',
        lead: 'What it’s made of.',
        text: 'The items in each change, and the pieces in each style or look, like wigs, lace and appliances.',
      },
      {
        icon: 'list',
        lead: 'A props breakdown.',
        text: 'Every prop in every scene and who has it, linked to the inventory.',
      },
      {
        icon: 'users',
        lead: 'A page for every character.',
        text: 'Everything about a character in one place, from every department.',
      },
      {
        icon: 'camera',
        lead: 'Every photo in one place.',
        text: 'One gallery for the whole production, in script order, with who added each photo and when.',
      },
    ],
  },
  {
    id: 'research',
    nav: 'Research',
    icon: 'pin',
    eyebrow: 'Research',
    heading: 'From reference to the real thing.',
    lede: 'Gather references in prep, share them with the department, and turn the ones you buy or make into inventory.',
    points: [
      {
        icon: 'camera',
        lead: 'Anything you find.',
        text: 'Photos, links and notes, from the camera, your library or the web.',
      },
      {
        icon: 'pin',
        lead: 'Pinned to the script.',
        text: 'Attach references to characters, scenes and locations.',
      },
      {
        icon: 'check',
        lead: 'Proposed to approved.',
        text: 'Track each reference from idea to approved, with its price and where it came from.',
      },
      {
        icon: 'tag',
        lead: 'Into the inventory.',
        text: 'Buy or make it, and the reference becomes an inventory item, with nothing typed twice.',
      },
    ],
    shot: { src: '/screens/research.webp', alt: 'The Research page in StageRoll, with a linked reference and a photographed one' },
  },
  {
    id: 'inventory',
    nav: 'Inventory',
    icon: 'box',
    eyebrow: 'Inventory',
    heading: 'Know what you have, what it cost and where it’s used.',
    lede: 'One inventory for the whole production, filed in folders and packed in crates.',
    points: [
      {
        icon: 'layers',
        lead: 'Folders, crates and closets.',
        text: 'Organise in folders, pack into crates, and keep each character’s things together.',
      },
      {
        icon: 'tag',
        lead: 'The full record.',
        text: 'Photos, sizes, costs and condition, and whether it was bought, rented, made or borrowed.',
      },
      {
        icon: 'clock',
        lead: 'Rented and borrowed.',
        text: 'Hire details and return dates for anything that has to go back.',
      },
      {
        icon: 'list',
        lead: 'Where it’s used.',
        text: 'See every scene and character an item is used for, and the research behind it.',
      },
      {
        icon: 'check',
        lead: 'Problems flagged.',
        text: 'Mark anything damaged, lost or in for repair, so nothing gets missed.',
      },
    ],
    shot: { src: '/screens/inventory.webp', alt: 'The Inventory page in StageRoll, with counts across the top and folders, a crate and items below' },
  },
  {
    id: 'scanning',
    nav: 'Scanning',
    icon: 'qr',
    eyebrow: 'Codes and scanning',
    heading: 'Scan it. It opens.',
    lede: 'Every item and crate has its own QR code, and your phone is the scanner.',
    points: [
      {
        icon: 'qr',
        lead: 'Codes of your own.',
        text: 'Short codes, unique to your production.',
      },
      {
        icon: 'camera',
        lead: 'A torch built in.',
        text: 'Scan a code and the item or crate opens, even in the back of a dark truck.',
      },
      {
        icon: 'userplus',
        lead: 'People too.',
        text: 'Scan someone’s code to invite them to the production.',
      },
    ],
    shot: { src: '/screens/scan.webp', alt: 'The StageRoll scanner, asking to point the phone at a label or a person’s code' },
  },
  {
    id: 'schedule',
    nav: 'Schedule',
    icon: 'calendar',
    eyebrow: 'Schedule',
    heading: 'Run the day.',
    lede: 'The app opens on today, with the day’s scenes, notes and what you were last working on.',
    points: [
      {
        icon: 'calendar',
        lead: 'The whole shoot on a calendar.',
        text: 'Book scenes onto shoot days, and plan prep, travel and days off around them.',
      },
      {
        icon: 'list',
        lead: 'Numbered like a call sheet.',
        text: 'Shoot days are counted the way the call sheet counts them.',
      },
      {
        icon: 'check',
        lead: 'Laid out in one go.',
        text: 'Set up the whole shoot at once, adjust the exceptions, and share it when it’s ready.',
      },
      {
        icon: 'users',
        lead: 'A sheet for every day.',
        text: 'Each day’s scenes in shoot order, with notes for yourself, your department or the whole production.',
      },
    ],
    shot: { src: '/screens/today.webp', alt: 'The StageRoll home page, showing today’s scenes, today’s notes and recent items' },
  },
  {
    id: 'reports',
    nav: 'Reports',
    icon: 'share',
    eyebrow: 'Reports',
    heading: 'Paperwork, made for you.',
    lede: 'Each department has its own reports, built from the production as it stands when you ask.',
    points: [
      {
        icon: 'users',
        lead: 'Just what you need.',
        text: 'Choose the characters and scenes, by shoot day or episode.',
      },
      {
        icon: 'share',
        lead: 'PDF or spreadsheet.',
        text: 'Share any report as a PDF, and export plots, inventories and props lists as spreadsheets.',
      },
      {
        icon: 'clock',
        lead: 'A record of what went out.',
        text: 'See every report sent, who sent it and when.',
      },
    ],
  },
  {
    id: 'team',
    nav: 'Team',
    icon: 'users',
    eyebrow: 'Team',
    heading: 'One production, the whole crew.',
    lede: 'Everyone works in the same production, each through their own department.',
    points: [
      {
        icon: 'users',
        lead: 'Three roles.',
        text: 'Owners, coordinators and crew, each with what their job needs.',
      },
      {
        icon: 'qr',
        lead: 'Invite in seconds.',
        text: 'Scan their code or add them by email, and the invite is waiting in the app.',
      },
      {
        icon: 'layers',
        lead: 'Your department, your view.',
        text: 'Everything opens on your department’s work, and you can switch at any time.',
      },
      {
        icon: 'userplus',
        lead: 'An account that’s yours.',
        text: 'Join several productions, move between them, and take your account to the next job.',
      },
    ],
  },
]

const privacy: Tile[] = [
  {
    icon: 'doc',
    heading: 'The script stays on your premises',
    text: 'It’s read on your own device, and the file is never uploaded. Only the scene headings, the cast and the file’s name are kept.',
  },
  {
    icon: 'lock',
    heading: 'Locked to you',
    text: 'Sign in with no password, and the app locks itself when you step away.',
  },
  {
    icon: 'phone',
    heading: 'Every device in view',
    text: 'See every device signed in to your account, and sign any of them out.',
  },
  {
    icon: 'shield',
    heading: 'Encrypted on your device',
    text: 'The copy of your production kept for offline use is encrypted, and cleared when you sign out.',
  },
  {
    icon: 'users',
    heading: 'Members only',
    text: 'In the app, a production’s work and photos are shown only to the people on it.',
  },
  {
    icon: 'eyeoff',
    heading: 'No ads, no selling',
    text: 'Your work is never sold, used for advertising or used to train AI.',
  },
]

const nav = [...sections.map((s) => ({ id: s.id, label: s.nav })), { id: 'privacy', label: 'Privacy' }]

// Which section is in the middle of the screen. Its link in the bar is lit,
// and on a narrow screen the bar scrolls to keep that link in view. Back up
// at the hero, nothing is.
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id || null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const hero = document.querySelector('.prod-hero')
    if (hero) io.observe(hero)
    for (const { id } of nav) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const row = bar.current
    if (!row) return
    const link = row.querySelector<HTMLElement>('[aria-current="true"]')
    const left = link ? link.offsetLeft - (row.clientWidth - link.clientWidth) / 2 : 0
    row.scrollTo({ left, behavior: 'smooth' })
  }, [active])
  return { active, bar }
}

function Points({ points }: { points: Point[] }) {
  return (
    <ul className="pts">
      {points.map((point) => (
        <li key={point.lead}>
          <Icon name={point.icon} />
          <span>
            <b>{point.lead}</b> {point.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Tiles({ tiles }: { tiles: Tile[] }) {
  return (
    <ul className="prod-tiles">
      {tiles.map((tile) => (
        <li key={tile.heading} className="reveal">
          <Icon name={tile.icon} />
          <h3>{tile.heading}</h3>
          <p>{tile.text}</p>
        </li>
      ))}
    </ul>
  )
}

function Head({ section }: { section: Section }) {
  return (
    <>
      <p className="k">
        <Icon name={section.icon} />
        {section.eyebrow}
      </p>
      <h2 id={`${section.id}-title`}>{section.heading}</h2>
      <p className="lede">{section.lede}</p>
    </>
  )
}

function Specs({ specs }: { specs: [string, string][] }) {
  return (
    <dl className="prod-specs">
      {specs.map(([term, detail]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{detail}</dd>
        </div>
      ))}
    </dl>
  )
}

// A feature: the words beside its points, or beside a screenshot of the app.
// The screenshots alternate sides down the page.
function Feature({ section, index, flip }: { section: Section; index: number; flip: boolean }) {
  const { shot } = section
  return (
    <section id={section.id} className={band(index)} aria-labelledby={`${section.id}-title`}>
      <div className="wrap">
        {shot ? (
          <div className={flip ? 'prod-row prod-shot flip' : 'prod-row prod-shot'}>
            <div className="prod-words reveal">
              <Head section={section} />
              <Points points={section.points} />
              {section.specs && <Specs specs={section.specs} />}
            </div>
            <div className="phone reveal">
              <div className="screen">
                <img className="prod-screen" src={shot.src} alt={shot.alt} width={600} height={1304} loading="lazy" />
              </div>
            </div>
          </div>
        ) : (
          <div className="prod-row">
            <div className="prod-head reveal">
              <Head section={section} />
            </div>
            <div className="reveal">
              <Points points={section.points} />
              {section.specs && <Specs specs={section.specs} />}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// The bands alternate white and paper down the page, ending on white above the footer.
const band = (i: number) => (i % 2 === 1 ? 'prod-sec tint' : 'prod-sec')

export function Product() {
  const { active, bar } = useActiveSection()
  const n = sections.length
  return (
    <div className="prod">
      <section className="prod-hero">
        <div className="wrap">
          <h1>Everything your department runs on.</h1>
          <p className="lede">
            Script, scenes, continuity, research, inventory, the schedule and the paperwork, in one production every
            department shares, from the first draft to wrap.
          </p>
          <ul className="prod-depts" aria-label="Departments">
            {departments.map((d) => (
              <li key={d.name}>
                <b>{d.name}</b>
                <span>{d.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <nav className="prod-bar" aria-label="On this page">
        <div ref={bar}>
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={item.id === active ? 'true' : undefined}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {sections.map((section, i) => (
        <Feature key={section.id} section={section} index={i} flip={section.id === 'research' || section.id === 'scanning'} />
      ))}

      <section id="privacy" className={band(n)} aria-labelledby="privacy-title">
        <div className="wrap">
          <div className="prod-center reveal">
            <p className="k">
              <Icon name="lock" />
              Privacy and security
            </p>
            <h2 id="privacy-title">Private by default.</h2>
            <p className="lede">What StageRoll keeps, where it keeps it, and who can see it.</p>
          </div>
          <Tiles tiles={privacy} />
        </div>
      </section>

      <section className={`${band(n + 1)} prod-end`} aria-labelledby="next-title">
        <div className="wrap">
          <div className="prod-center reveal">
            <h2 id="next-title">Ready for your next production.</h2>
            <p className="lede">Plans are per production, and every crew account is free.</p>
            <div className="acts">
              <a className="pill dark" href="/pricing/">
                See pricing
              </a>
              <a className="pill" href="/contact/">
                Get in touch <Icon name="chevron" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
