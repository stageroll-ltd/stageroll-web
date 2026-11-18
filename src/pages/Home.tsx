import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { Icon } from '../components/Icon'
import { StoreBadges } from '../components/StoreBadges'
import { runHeroLines } from '../heroLines'
import { departmentPages } from './departments'
import { featurePages } from './features'

// The home page: a framed column (home.css). The page's words sit in a
// column, 1264px at its widest, with a rail at each edge; down it go the hero, the
// facts, what joins up in one production (the bands), then the product as a
// whole: continuity and inventory as equals, the areas round them, what it
// is all built on, privacy, a row of doors to the departments, pricing in a
// line and the close (HomeEnd, below).

/** A feature's own page under /product/ (pages/features.ts), or the overview if it has none. */
const featureHref = (slug: string) => (featurePages.some((page) => page.slug === slug) ? `/product/${slug}/` : '/product/')

/** A department's own page (pages/departments.ts), if it has one. */
const departmentHref = (slug: string) =>
  departmentPages.some((page) => page.slug === slug) ? `/departments/${slug}/` : undefined

// The departments: a name in the hero's strip, and a door each further down.
const departments: { name: string; slug: string }[] = [
  { name: 'Costume', slug: 'costume' },
  { name: 'Props', slug: 'props' },
  { name: 'Hair', slug: 'hair' },
  { name: 'Makeup', slug: 'makeup' },
  { name: 'Set', slug: 'sets' },
]

const privacy: { heading: string; text: string }[] = [
  // The facts row above has already said the script stays on the device, so
  // the two things not yet said come first.
  { heading: 'Locked to you.', text: 'A PIN and Face ID, with screen protection for productions that need it.' },
  { heading: 'No ads, no selling.', text: 'Your work is never sold, used for advertising or used to train AI.' },
  { heading: 'Read on your device.', text: 'The script file is never uploaded.' },
]

type Screen = 'change' | 'inventory-list' | 'research-board' | 'calendar'

/** A phone with one of the app's screenshots (public/screens/), cut off by the foot of its picture. */
function Phone({ screen }: { screen: Screen }) {
  return (
    <span className="hm-shot" aria-hidden="true">
      <img src={`/screens/${screen}.webp`} alt="" width={600} height={1304} loading="lazy" decoding="async" />
    </span>
  )
}

// Pieces of the app drawn in the page, not screenshots: the card that says a
// script has been read, and a shoot day. Pictures, so a screen reader is not
// read their sample words.
function ScriptFound() {
  return (
    <span className="hm-ui hm-script" aria-hidden="true">
      <span className="hm-ui-head">
        <b>The script</b>
        <small>Episode 4</small>
      </span>
      <span className="hm-ui-row">
        <svg width="16" height="18" viewBox="0 0 16 18">
          <path d="M3 1h6.5L14 5.5V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" />
          <path d="M5 9.5h6M5 12.5h6" />
        </svg>
        <span>a1-white.fdx</span>
        <small>9 KB</small>
      </span>
      <span className="hm-ui-row">
        <span>12 scenes and 8 characters found.</span>
        <svg className="ok" width="22" height="22" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="9.25" />
          <path d="M7 11.5 10 14.5 15.5 8" />
        </svg>
      </span>
    </span>
  )
}

function ShootDay() {
  return (
    <span className="hm-ui hm-day" aria-hidden="true">
      <span className="hm-ui-head">
        <small>Shoot day 8 of 9</small>
        <b className="big">Monday</b>
        <small>12 October 2026</small>
      </span>
      <span className="hm-ui-row">
        <span>Scene 13</span>
        <span className="hm-ui-pill">Shooting</span>
      </span>
    </span>
  )
}

// The two halves of the product, as equals: a name, one line, three short
// tags and the way to its page (features.ts). The pictures are in Home, below.
const pillars = {
  continuity: {
    name: 'Continuity',
    line: 'Every change, style, look and prop, kept against its scene.',
    tags: ['By scene and character', 'Photos with the notes', 'Each department’s view'],
    link: 'How continuity works',
  },
  inventory: {
    name: 'Inventory',
    line: 'Everything the production owns, and where it is right now.',
    tags: ['Items and crates', 'A code on every piece', 'Tied to its scenes'],
    link: 'How inventory works',
  },
}

function PillarHead({ slug }: { slug: keyof typeof pillars }) {
  const { name, line, tags, link } = pillars[slug]
  return (
    <div className="hm-pillar-head">
      <div>
        <h3>{name}</h3>
        <a href={featureHref(slug)}>
          {link} <Icon name="chevron" />
        </a>
      </div>
      <p>{line}</p>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}

// Who is on a production, drawn: the owner, a coordinator for each
// department, and their crew.
function TeamTree() {
  const crew = (cx: number, tone: string) => (
    <>
      {[-38, 0, 38].map((dx) => (
        <g key={dx}>
          <path className="line" d={`M${cx} 120V142H${cx + dx}V160`} />
          <circle cx={cx + dx} cy={174} r={14} fill={`var(--hm-${tone})`} />
        </g>
      ))}
      <text className="quiet" x={cx} y={212}>
        Crew
      </text>
    </>
  )
  const coordinator = (cx: number, department: string, tone: string) => (
    <>
      <rect x={cx - 54} y={78} width={108} height={42} rx={21} fill={`var(--hm-${tone})`} />
      <text className="on" x={cx} y={96}>
        Coordinator
      </text>
      <text className="on small" x={cx} y={110.5}>
        {department}
      </text>
    </>
  )
  return (
    <svg className="hm-tree" viewBox="0 0 248 226" aria-hidden="true">
      <path className="line" d="M124 33V56H62V78M124 56H186V78" />
      {crew(62, 'top')}
      {crew(186, 'glow')}
      <rect x={82} y={3} width={84} height={30} rx={15} fill="var(--ink)" />
      <text className="on" x={124} y={22.5}>
        Owner
      </text>
      {coordinator(62, 'Costume', 'deep')}
      {coordinator(186, 'Props', 'mid')}
    </svg>
  )
}

// What it is all built on, and the pages for each (features.ts).
const base: [label: string, slug: string][] = [
  ['Script breakdown', 'script'],
  ['Scenes', 'scenes'],
  ['Schedule', 'schedule'],
  ['Codes and scanning', 'scanning'],
]

// The hero's strip: what StageRoll does, then the departments it is for.
const covers = ['Research', 'Continuity', 'Inventory', 'Reporting', ...departments.map((d) => d.name)]

// Four plain facts, where other sites put numbers. The two about price are
// ways to buy, so they go when the app opened the page (`.sells`).
const facts: { label: string; fact: string; sells?: boolean }[] = [
  { label: 'Built for', fact: 'iPhone, iPad and Android' },
  { label: 'Price', fact: 'Free to start', sells: true },
  { label: 'Plans', fact: 'Every department on every plan', sells: true },
  { label: 'Your script', fact: 'Read on your device, never uploaded' },
]

// The facts as a second ruled row straight under the departments' names:
// still, between the hero's lines and the bands below.
function HomeGlance() {
  return (
    <section className="hm-glance" aria-label="At a glance">
      <dl className="hm-col hm-facts">
        {facts.map(({ label, fact, sells }) => (
          <div key={label} className={sells ? 'hm-fact sells' : 'hm-fact'}>
            <dt>{label}</dt>
            <dd>{fact}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// What joins up in one production, as bands that close into one block
// (JoinBands, below), deepest colour first. Budgeting is not built yet: its
// band is an outline, and it comes last.
// `slug` is the band's page under /product/ (features.ts): its name is the way there.
const joins: { name: string; line?: string; slug?: string; tone?: 'deep' | 'mid' | 'top' | 'ember' | 'glow' }[] = [
  { name: 'Research', line: 'References for every look and set', slug: 'research', tone: 'deep' },
  { name: 'Inventory', line: 'Every piece, and where it is', slug: 'inventory', tone: 'mid' },
  { name: 'Continuity', line: 'Photos and notes, scene by scene', slug: 'continuity', tone: 'top' },
  { name: 'Collaboration', line: 'Your whole team in one production', slug: 'team', tone: 'ember' },
  { name: 'Reporting', line: 'Breakdowns of scenes, cast and crew', slug: 'reports', tone: 'glow' },
  { name: 'Budgeting' },
]

// The drawing is 1232 wide: each band is 62 tall, 30 apart on the left and
// touching on the right, so its height and the block's place in it follow
// from how many bands there are (home.css works out the same from --n).
// The bands close up between 440 and 770 across and end at joinEnd; a
// bracket down the block's end ties them all to its words, which take the
// rest of the width on two lines (home.css).
const joinEnd = 1046
const joinHeight = joins.length * 92 - 30
const blockTop = 15 * (joins.length - 1)
const bandApart = (i: number) => i * 92 + 31
const bandJoined = (i: number) => blockTop + i * 62 + 31

/** How much taller, above and below, the band under the pointer grows on its level part (home.css makes its line thicker by twice this). */
const LIFT = 7
/** A place in the drawing, to a tenth. */
const at = (v: number) => Math.round(v * 10) / 10

/** A band's turn to arrive (the delays in home.css) and its colour, one of the sunset's. */
const turn = (i: number, tone?: string) => ({ '--i': i, ...(tone && { '--tone': `var(--hm-${tone})` }) }) as CSSProperties

// The bands, one for each thing a production keeps, that run in from the
// left and close into one block; a bracket as tall as the block names it:
// "One production". On a phone they are a stack of bars.
// They arrive one after another the first time the drawing is on screen,
// then the bracket grows from its middle and its words appear
// (home.css, once `hm-in` is set); until then, and with motion reduced or no
// script, the finished drawing is simply there.
// Each name is the way to its page. The band under the pointer keeps its
// colour while the others fall back (`data-hot`); its level part on the left
// grows a little taller, narrowing all the way along the curve to its own
// height where it joins the block, and its name moves a step in (home.css).
// That holds while the bands are still arriving too: a band's whole shape
// answers to the pointer whether or not it is drawn yet.
function JoinBands() {
  const box = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState<number | null>(null)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const seen = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        el.classList.add('hm-in')
        seen.disconnect()
      },
      { threshold: 0.35 },
    )
    seen.observe(el)
    return () => seen.disconnect()
  }, [])
  const over = (i: number) => () => setHot(i)
  const out = () => setHot(null)
  return (
    // The class `hm-in` is set on the element itself, so what React changes
    // here is an attribute of its own, never the class.
    <div ref={box} className="hm-join" data-hot={hot ?? undefined} style={{ '--n': joins.length } as CSSProperties} onPointerLeave={out}>
      <svg viewBox={`0 0 1232 ${joinHeight}`} aria-hidden="true">
        {/* Each band is a group of three lines along its middle. The band itself, thick, so it can be
            drawn from left to right. The same line again, drawn with it, which home.css makes thicker
            under the pointer: that copy is cut to a shape, all of it on the level part, then less and
            less along the curve, each edge one curve from the taller height to the band's own at the
            block (where the cut ends), so it never turns back on itself; at rest the copy is thinner
            than the band and lies unseen inside it. And the line once more, unseen, for the pointer:
            it is all there from the start, so a band answers before it is drawn. They fade as one,
            so the copy never shows through. */}
        {joins.map(({ name, tone }, i) => {
          if (!tone) return null
          const a = bandApart(i)
          const j = bandJoined(i)
          const tall = 31.3 + LIFT
          const top = at(a - tall)
          const foot = at(a + tall)
          const joinedTop = at(j - 31.3)
          const joinedFoot = at(j + 31.3)
          const line = `M-2 ${a}H440C605 ${a} 605 ${j} 770 ${j}H${joinEnd}`
          return (
            <g key={name} className={hot === i ? 'hm-row hm-on' : 'hm-row'} style={turn(i, tone)}>
              <path className="hm-band" pathLength={1} d={line} />
              <clipPath id={`hm-lift-${i}`}>
                <path
                  d={`M-10 ${a - 60}H440V${top}C605 ${top} 605 ${joinedTop} 770 ${joinedTop}V${joinedFoot}C605 ${joinedFoot} 605 ${foot} 440 ${foot}V${a + 60}H-10Z`}
                />
              </clipPath>
              <path className="hm-lift" pathLength={1} d={line} clipPath={`url(#hm-lift-${i})`} />
              <path className="hm-hit" d={line} onPointerEnter={over(i)} />
            </g>
          )
        })}
        {joins.map(({ name, tone }, i) => {
          if (tone) return null
          const a = bandApart(i)
          const j = bandJoined(i)
          // The band still to come: its outline, over the edges of its neighbours.
          return (
            <path
              key={name}
              className="hm-slot"
              style={turn(i)}
              d={`M1 ${a - 31}H440C605 ${a - 31} 605 ${j - 31} 770 ${j - 31}H${joinEnd - 1}V${j + 31}H770C605 ${j + 31} 605 ${a + 31} 440 ${a + 31}H1Z`}
            />
          )
        })}
        {/* The bracket down the block's end, in two halves from its middle, so it can grow out to both ends. */}
        <path className="hm-brace" pathLength={1} d={`M${joinEnd + 28} ${joinHeight / 2}V${blockTop + 1}H${joinEnd + 16}`} />
        <path className="hm-brace" pathLength={1} d={`M${joinEnd + 28} ${joinHeight / 2}V${blockTop + joins.length * 62 - 1}H${joinEnd + 16}`} />
      </svg>
      <ul>
        {joins.map(({ name, line, slug, tone }, i) => (
          // White words on every band; ink on the outline, which has no colour behind it.
          <li
            key={name}
            className={[!tone && 'hm-ink hm-soon', hot === i && 'hm-on'].filter(Boolean).join(' ') || undefined}
            style={turn(i, tone)}
            onPointerEnter={tone ? over(i) : undefined}
          >
            {slug ? (
              <a className="hm-join-go" href={featureHref(slug)}>
                <strong>{name}</strong>
                <span>{line}</span>
                <Icon name="chevron" />
              </a>
            ) : (
              <>
                <strong>{name}</strong>
                <em>Coming soon</em>
              </>
            )}
          </li>
        ))}
      </ul>
      <p className="hm-join-one">One production</p>
    </div>
  )
}

// The hero's lines: a ribbon of fine lines behind the words, drawn and moved
// in the browser (heroLines.ts), which fits it round the words at any size.
// The page is built with the drawing empty; the lines fade in once drawn.
function HeroLines() {
  const svg = useRef<SVGSVGElement>(null)
  useEffect(() => (svg.current ? runHeroLines(svg.current) : undefined), [])
  return <svg ref={svg} className="hm-lines" aria-hidden="true" />
}

export function Home() {
  return (
    <div className="hm">
      <div className="hm-rails" aria-hidden="true" />

      <section className="hm-hero">
        {/* The lines fill the stage behind the words and stop at the strip. */}
        <div className="hm-stage">
          <HeroLines />
          <div className="hm-col hm-hero-in">
            <p className="hm-kicker">Continuity and inventory for film and TV</p>
            {/* One block of type in two voices: the headline, then the sentence
                that runs on from it at the same size, in the second colour. */}
            <div className="hm-two hm-lead">
              <h1>Production management, done right.</h1>{' '}
              <p>StageRoll keeps continuity for film and TV productions of any size, from research and physical inventory through to wrap.</p>
            </div>
            <div className="hm-acts">
              <a className="hm-btn dark" href="/product/">
                See the product <Icon name="chevron" />
              </a>
              <a className="hm-btn sells" href="/pricing/">
                See pricing
              </a>
            </div>
          </div>
        </div>
        {/* What it does, then who it is for, moving slowly to the left in a
            loop (home.css): the list twice over, so as one copy leaves the
            other has taken its place. The second copy is only for the eye. */}
        <div className="hm-strip">
          <div className="hm-col hm-ticker">
            <ul aria-label="What StageRoll does, and the departments it is for">
              {covers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <ul aria-hidden="true">
              {covers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HomeGlance />

      <section className="hm-sec" aria-labelledby="hm-does">
        <div className="hm-col hm-inset">
          <div className="hm-two hm-two-wide">
            <h2 id="hm-does">One production for costume, props, hair, makeup and set.</h2>{' '}
            <p>Script analysis, continuity, research, inventory and labels in one place.</p>
          </div>
          <JoinBands />
          {/* A line between the bands and the panels: room to breathe, and what comes next. */}
          <h3 className="hm-lead-in">Continuity and inventory, built as equals.</h3>

          {/* Continuity and inventory, side by side as equals. */}
          <div className="hm-pair">
            <article className="hm-pillar sun">
              <PillarHead slug="continuity" />
              <div className="hm-pillar-art">
                <img className="hm-sheet" src="/screens/page-book.webp" alt="" width={760} height={805} loading="lazy" decoding="async" />
                <Phone screen="change" />
              </div>
            </article>
            <article className="hm-pillar inv">
              <PillarHead slug="inventory" />
              <div className="hm-pillar-art">
                <Phone screen="inventory-list" />
                <img className="hm-item" src="/screens/item-card.webp" alt="" width={720} height={347} loading="lazy" decoding="async" />
                <span className="hm-due" aria-hidden="true">
                  <span>
                    Acquired <b>Rented</b>
                  </span>
                  <span>
                    Return due <b>15 January</b>
                  </span>
                </span>
              </div>
            </article>
          </div>

          {/* The areas round them: a tile each, and one still to come. */}
          <div className="hm-around">
            <a className="hm-tile" href={featureHref('research')}>
              <h3>
                Research <Icon name="chevron" />
              </h3>
              <p>Pin references to characters, scenes and sets.</p>
              <span className="hm-tile-art">
                <Phone screen="research-board" />
              </span>
            </a>
            <a className="hm-tile" href={featureHref('team')}>
              <h3>
                Collaboration <Icon name="chevron" />
              </h3>
              <p>Owner, coordinators and crew, each in their own department.</p>
              <span className="hm-tile-art">
                <TeamTree />
              </span>
            </a>
            <a className="hm-tile" href={featureHref('reports')}>
              <h3>
                Reporting <Icon name="chevron" />
              </h3>
              <p>Each department’s paperwork, built when you ask.</p>
              <span className="hm-tile-art">
                <img className="hm-sheet" src="/screens/page-report.webp" alt="" width={900} height={632} loading="lazy" decoding="async" />
              </span>
            </a>
            <div className="hm-tile soon">
              <h3>Budgeting</h3>
              <span className="hm-soon-tag">Coming soon</span>
              <p>Production and department budgets.</p>
              <span className="hm-tile-art hm-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>

          {/* What every record hangs off: the script and the shooting schedule. */}
          <div className="hm-base">
            <div className="hm-base-copy">
              <h3>Built on your script and your shooting schedule.</h3>
              <p>Every record hangs off a scene, so a new draft updates everything that depends on it.</p>
              <ul>
                {base.map(([label, slug]) => (
                  <li key={slug}>
                    <a href={featureHref(slug)}>
                      {label} <Icon name="chevron" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hm-base-art">
              <ScriptFound />
              <ShootDay />
              <Phone screen="calendar" />
            </div>
          </div>
        </div>
      </section>

      <section className="hm-sec flush" aria-labelledby="hm-private">
        <div className="hm-col hm-inset">
          <div className="hm-private">
            <div className="hm-private-head">
              <h2 id="hm-private">Private by default.</h2>
              <a className="hm-btn ghost" href={featureHref('privacy')}>
                Privacy and security <Icon name="chevron" />
              </a>
            </div>
            <ul className="hm-trio">
              {privacy.map((p) => (
                <li key={p.heading}>
                  <h3>{p.heading}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The departments: one row of doors. */}
      <section className="hm-doors" aria-labelledby="hm-depts">
        <div className="hm-col hm-inset">
          <h2 id="hm-depts">See it for your department</h2>
          <ul>
            {departments.map((d) => {
              const href = departmentHref(d.slug)
              return (
                href && (
                  <li key={d.name}>
                    <a className="hm-btn" href={href}>
                      {d.name} <Icon name="chevron" />
                    </a>
                  </li>
                )
              )
            })}
          </ul>
        </div>
      </section>

      {/* A way to buy, so it goes when the app opened the page (`.sells`). */}
      <section className="hm-price sells" aria-label="Pricing">
        <div className="hm-col hm-inset">
          <div className="hm-two">
            <h2>Priced per production.</h2> <p>Crew never pay.</p>
          </div>
          <a className="hm-btn dark" href="/pricing/">
            See pricing <Icon name="chevron" />
          </a>
        </div>
      </section>
    </div>
  )
}

// The close, under the page and above the footer (routes.tsx `End`): the
// words, where to get the app, and the sunset bands laid flat as a horizon.
export function HomeEnd() {
  return (
    <section className="hm-close" id="get">
      <div className="hm-col">
        <h2>Your next production, sorted.</h2>
        <p>One production, every department, from research to wrap.</p>
        <StoreBadges />
      </div>
      <div className="hm-bands" aria-hidden="true" />
    </section>
  )
}
