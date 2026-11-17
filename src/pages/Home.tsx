import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

import { Icon } from '../components/Icon'
import { Photo } from '../components/Photo'
import { StoreBadges } from '../components/StoreBadges'
import { runHeroLines } from '../heroLines'
import type { PhotoKey } from '../photos'
import { departmentPages } from './departments'
import { featurePages } from './features'

// The home page: a framed column (home.css). The page's words sit in a
// column, 1264px at its widest, with a rail at each edge; down it go the hero, what the app
// does as six cards, how a department works in three steps, privacy, the
// five departments, pricing in a line and the close (HomeEnd, below).

/** A feature's own page under /product/ (pages/features.ts), or the overview if it has none. */
const featureHref = (slug: string) => (featurePages.some((page) => page.slug === slug) ? `/product/${slug}/` : '/product/')

/** A department's own page (pages/departments.ts), if it has one. */
const departmentHref = (slug: string) =>
  departmentPages.some((page) => page.slug === slug) ? `/departments/${slug}/` : undefined

// The departments: a name in the hero's strip, then a row each further down,
// with its line. All five lines are in the page, for a search engine as much
// as a reader.
const departments: { name: string; slug: string; photo: PhotoKey; line: string }[] = [
  { name: 'Costume', slug: 'costume', photo: 'costume', line: 'Changes, fittings and continuity for every character.' },
  { name: 'Props', slug: 'props', photo: 'props', line: 'Every piece, where it’s used and where it lives.' },
  { name: 'Hair', slug: 'hair', photo: 'hair', line: 'Styles and references, scene by scene.' },
  { name: 'Makeup', slug: 'makeup', photo: 'makeup', line: 'Looks, continuity photos and notes, ready for every call.' },
  { name: 'Set', slug: 'sets', photo: 'set', line: 'Dressing and continuity for every set, scene by scene.' },
]

// The workflow, in the order a department works.
const steps: { heading: string; text: string }[] = [
  {
    heading: 'Analyse the script.',
    text: 'Every scene, every character, who’s in which. Pulled from the script in seconds, and the file itself never leaves your device.',
  },
  {
    heading: 'Break it down.',
    text: 'References pinned to every character and scene, and the inventory behind them, photographed and ready to pack.',
  },
  {
    heading: 'Run the day.',
    text: 'Coordinate shoot days, see what every scene needs, and capture continuity on set.',
  },
]

const privacy: { heading: string; text: string }[] = [
  { heading: 'Read on your device.', text: 'The script file is never uploaded, only the scene and character metadata you choose to submit.' },
  { heading: 'Locked to you.', text: 'A PIN and Face ID, with screen protection for productions that need it.' },
  { heading: 'No ads, no selling.', text: 'Your work is never sold, used for advertising or used to train AI.' },
]

type Screen = 'today' | 'script' | 'character' | 'scene' | 'shootday' | 'team'

/** A phone with one of the app's screenshots (public/screens/), cut off by its card's foot. */
function Shot({ screen }: { screen: Screen }) {
  return (
    <span className="hm-phone" aria-hidden="true">
      <img src={`/screens/${screen}.webp`} alt="" width={600} height={1304} loading="lazy" decoding="async" />
    </span>
  )
}

// Three pieces of the app drawn in the page, not screenshots: the card that
// says a script has been read, a shoot day, and a printed label. Pictures, so
// a screen reader is not read their sample words.
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

// The code on the drawn label: a picture of a QR code, not one that scans.
const labelCode =
  'M0 0h7v7h-7z M1 1h5v5h-5z M2 2h3v3h-3z M14 0h7v7h-7z M15 1h5v5h-5z M16 2h3v3h-3z M0 14h7v7h-7z M1 15h5v5h-5z M2 16h3v3h-3z M8 0h1v1h-1z M10 0h1v1h-1z M11 1h1v1h-1z M9 2h1v1h-1z M12 2h1v1h-1z M8 3h1v1h-1z M10 4h1v1h-1z M12 4h1v1h-1z M9 5h1v1h-1z M11 6h1v1h-1z M8 6h1v1h-1z M0 8h1v1h-1z M2 8h1v1h-1z M3 9h1v1h-1z M5 8h1v1h-1z M1 10h1v1h-1z M4 10h1v1h-1z M6 11h1v1h-1z M0 12h1v1h-1z M3 12h1v1h-1z M5 12h1v1h-1z M8 8h1v1h-1z M9 9h1v1h-1z M11 8h1v1h-1z M12 10h1v1h-1z M10 11h1v1h-1z M8 12h1v1h-1z M13 9h1v1h-1z M14 8h1v1h-1z M16 8h1v1h-1z M18 9h1v1h-1z M20 8h1v1h-1z M15 10h1v1h-1z M17 11h1v1h-1z M19 12h1v1h-1z M14 12h1v1h-1z M20 11h1v1h-1z M8 14h1v1h-1z M10 15h1v1h-1z M9 16h1v1h-1z M12 14h1v1h-1z M11 17h1v1h-1z M8 18h1v1h-1z M13 19h1v1h-1z M10 20h1v1h-1z M12 20h1v1h-1z M15 14h1v1h-1z M17 15h1v1h-1z M19 14h1v1h-1z M16 17h1v1h-1z M18 18h1v1h-1z M20 16h1v1h-1z M14 19h1v1h-1z M16 20h1v1h-1z M20 20h1v1h-1z M18 16h1v1h-1z'

function PrintedLabel() {
  return (
    <span className="hm-ui hm-label" aria-hidden="true">
      <span className="hm-label-band">
        <span>Provenance</span>
        <img src="/brand/wordmark-dark.svg" alt="" width={41} height={11} loading="lazy" />
      </span>
      <span className="hm-label-body">
        <span>
          <small>Props</small>
          <b>Gold watch</b>
        </span>
        <span className="hm-label-code">
          <svg viewBox="0 0 21 21" width="78" height="78" shapeRendering="crispEdges" fillRule="evenodd">
            <path d={labelCode} />
          </svg>
          SR7KM40042
        </span>
      </span>
    </span>
  )
}

// What StageRoll does, as six cards: each a heading, one line, its feature
// page and the app inside it. `look` is the card's place in the grid and its
// colour family (home.css).
const cards: { heading: string; text: string; slug: string; look: string; art: ReactNode }[] = [
  {
    heading: 'Script analysis, simplified.',
    text: 'Scenes, characters and who’s in each, laid out in script order.',
    slug: 'script',
    look: 'wide top sunset',
    art: (
      <>
        <ScriptFound />
        <Shot screen="script" />
      </>
    ),
  },
  {
    heading: 'Continuity, tracked.',
    text: 'Recorded against every scene and character in your script.',
    slug: 'continuity',
    look: 'top iris',
    art: <Shot screen="character" />,
  },
  {
    heading: 'From reference to wrap box.',
    text: 'Pin research references to characters, scenes and sets.',
    slug: 'research',
    look: 'lagoon',
    art: <Shot screen="scene" />,
  },
  {
    heading: 'Physical meets digital.',
    text: 'Every item and crate wears its own QR label.',
    slug: 'scanning',
    look: 'forest',
    art: <PrintedLabel />,
  },
  {
    heading: 'Always there for the whole team.',
    text: 'Scan a crew member’s code to invite them, with their role.',
    slug: 'team',
    look: 'midnight',
    art: <Shot screen="team" />,
  },
  {
    heading: 'Run the day.',
    text: 'Coordinate shoot days, see what every scene needs, and capture continuity on set.',
    slug: 'schedule',
    look: 'full coral',
    art: (
      <>
        <ShootDay />
        <Shot screen="shootday" />
        <Shot screen="today" />
      </>
    ),
  },
]

// What joins up in one production, as five bands that close into one block
// (JoinBands, below). Budgeting is not built yet: its band is an outline,
// and it comes last.
const joins: { name: string; line?: string; tone?: 'deep' | 'mid' | 'top' | 'glow' }[] = [
  { name: 'Research', line: 'References for every look and set', tone: 'deep' },
  { name: 'Inventory', line: 'Every piece, and where it is', tone: 'mid' },
  { name: 'Continuity', line: 'Photos and notes, scene by scene', tone: 'top' },
  { name: 'Collaboration', line: 'Your whole team in one production', tone: 'glow' },
  { name: 'Budgeting' },
]

// The drawing is 1232 by 430: each band is 62 tall, 30 apart on the left and
// touching on the right. The bands close up between 440 and 770 across and
// end at 980; a bracket down the block's end ties all five to its words.
const bandApart = (i: number) => i * 92 + 31
const bandJoined = (i: number) => 60 + i * 62 + 31

/** A band's turn to arrive (the delays in home.css) and its colour, one of the sunset's. */
const turn = (i: number, tone?: string) => ({ '--i': i, ...(tone && { '--tone': `var(--hm-${tone})` }) }) as CSSProperties

// Five bands, one for each thing a production keeps, that run in from the
// left and close into one block; a bracket as tall as the block names it:
// "One production". On a phone they are a stack of five bars.
// They arrive one after another the first time the drawing is on screen,
// then the bracket grows from its middle and its words appear
// (home.css, once `hm-in` is set); until then, and with motion reduced or no
// script, the finished drawing is simply there.
function JoinBands() {
  const box = useRef<HTMLDivElement>(null)
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
  return (
    <div ref={box} className="hm-join">
      <svg viewBox="0 0 1232 430" aria-hidden="true">
        {joins.map(({ name, tone }, i) => {
          if (!tone) return null
          const a = bandApart(i)
          const j = bandJoined(i)
          // A thick line along the band's middle, so it can be drawn from left to right.
          return <path key={name} className="hm-band" style={turn(i, tone)} pathLength={1} d={`M-2 ${a}H440C605 ${a} 605 ${j} 770 ${j}H980`} />
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
              d={`M1 ${a - 31}H440C605 ${a - 31} 605 ${j - 31} 770 ${j - 31}H979V${j + 31}H770C605 ${j + 31} 605 ${a + 31} 440 ${a + 31}H1Z`}
            />
          )
        })}
        {/* The bracket down the block's end, in two halves from its middle, so it can grow out to both ends. */}
        <path className="hm-brace" pathLength={1} d="M1008 215V61H996" />
        <path className="hm-brace" pathLength={1} d="M1008 215V369H996" />
      </svg>
      <ul>
        {joins.map(({ name, line, tone }, i) => (
          // Ink words on the orange band and on the outline; white on the rest.
          <li key={name} className={tone ? (tone === 'glow' ? 'hm-ink' : undefined) : 'hm-ink hm-soon'} style={turn(i, tone)}>
            <strong>{name}</strong>
            {line ? <span>{line}</span> : <em>Coming soon</em>}
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
            <p className="hm-kicker">Made for costume, props, hair, makeup and set</p>
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
        <div className="hm-strip">
          <ul className="hm-col" aria-label="Departments">
            {departments.map((d) => (
              <li key={d.name}>{d.name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hm-sec" aria-labelledby="hm-does">
        <div className="hm-col hm-inset">
          <div className="hm-two">
            <h2 id="hm-does">One production for costume, props, hair, makeup and set.</h2>{' '}
            <p>Script analysis, continuity, research, inventory and labels in one place.</p>
          </div>
          <JoinBands />
          <div className="hm-cards">
            {cards.map((card) => (
              <a key={card.slug} className={`hm-card ${card.look}`} href={featureHref(card.slug)}>
                <h3>{card.heading}</h3>
                <p>{card.text}</p>
                <span className="hm-go" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M3 9 9 3M4.5 3H9v4.5" />
                  </svg>
                </span>
                {card.art}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="hm-how">
        <div className="hm-col hm-inset">
          <div className="hm-banner">
            <div className="hm-banner-copy">
              <h2 id="hm-how">Modern by design.</h2>
              <p>Take photos, scan labels and check the day’s scenes from the phone or tablet already in your pocket.</p>
              <a className="hm-btn onink" href="/product/">
                See everything StageRoll does <Icon name="chevron" />
              </a>
            </div>
            <div className="hm-banner-photo">
              <Photo slot="set" />
            </div>
          </div>
        </div>
        {/* The three steps as a row of large figures; the numbers are the
            list's own (home.css). */}
        <div className="hm-steps">
          <ol className="hm-col">
            {steps.map((s) => (
              <li key={s.heading}>
                <h3>{s.heading}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hm-sec" aria-labelledby="hm-private">
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

      <section className="hm-sec flush" aria-labelledby="hm-depts">
        <div className="hm-col">
          <div className="hm-two hm-inset">
            <h2 id="hm-depts">Made for your department.</h2>{' '}
            <p>Everyone works in their own department’s view, and changes reach the whole team straight away.</p>
          </div>
          <ul className="hm-rows">
            {departments.map((d) => {
              const href = departmentHref(d.slug)
              const row = (
                <>
                  <Photo slot={d.photo} />
                  <h3>{d.name}</h3>
                  <p>{d.line}</p>
                  {href && <Icon name="chevron" />}
                </>
              )
              return (
                <li key={d.name}>
                  {href ? (
                    <a className="hm-row" href={href}>
                      {row}
                    </a>
                  ) : (
                    <div className="hm-row">{row}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* A way to buy, so it goes when the app opened the page (`.sells`). */}
      <section className="hm-price sells" aria-label="Pricing">
        <div className="hm-col hm-inset">
          <div className="hm-two">
            <h2>Free to start.</h2> <p>Every department on every plan.</p>
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
