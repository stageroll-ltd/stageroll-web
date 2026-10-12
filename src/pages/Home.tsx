import { useEffect, useRef, useState } from 'react'

import { useStoryMotion } from '../storyMotion'
import { Icon, type IconName } from '../components/Icon'
import { Photo } from '../components/Photo'
import { StoreBadges } from '../components/StoreBadges'

type Point = { icon: IconName; text: string }

type Feature = {
  eyebrow: string
  icon: IconName
  heading: string
  points: Point[]
}

// The four things StageRoll does, as equals, one after another on a white
// page. With motion each fades up from below as it reaches the screen
// (storyMotion.ts).
const features: Feature[] = [
  {
    eyebrow: 'Script analysis',
    icon: 'doc',
    heading: 'Script analysis, simplified.',
    points: [
      { icon: 'list', text: 'Scenes, characters and who’s in each, laid out in script order.' },
      { icon: 'users', text: 'Messy cast lists, tidied up for you.' },
      { icon: 'layers', text: 'New drafts are matched scene by scene, and renamed characters keep their wardrobe.' },
      { icon: 'check', text: 'Anything it isn’t sure of, it asks. Nothing changes until you approve it.' },
    ],
  },
  {
    eyebrow: 'Continuity',
    icon: 'camera',
    heading: 'Continuity, tracked.',
    points: [
      { icon: 'list', text: 'Continuity recorded against every scene and character in your script.' },
      { icon: 'layers', text: 'Notes, photos and inventory, kept to their department.' },
      { icon: 'users', text: 'Always there for the whole team, at any time.' },
    ],
  },
  {
    eyebrow: 'Research and inventory',
    icon: 'search',
    heading: 'From reference to wrap box.',
    points: [
      { icon: 'pin', text: 'Pin research references to characters, scenes and sets.' },
      { icon: 'wifi', text: 'Research even when offline, so StageRoll stays the single source of truth for your production.' },
      { icon: 'tag', text: 'Turn research into inventory, bought, made or hired, still tied to the scenes it was found for.' },
      { icon: 'box', text: 'Pack crates against a packing list, so nothing goes to wrap unaccounted for.' },
    ],
  },
  {
    eyebrow: 'Labels and scanning',
    icon: 'qr',
    heading: 'Physical meets digital.',
    points: [
      { icon: 'qr', text: 'Every item and crate wears its own QR label, so what’s on the shelf matches what’s in StageRoll.' },
      { icon: 'userplus', text: 'Scan a crew member’s code to invite them to the production, with their role.' },
    ],
  },
]

// The workflow, in the order a department works. `screen` names the
// screenshot each step shows (`captured`, below); until one is taken the
// phone shows a labelled placeholder. `side` is a second screen on a second
// phone, which the scroll story slides out from behind the first at the
// first step that has one and keeps out, changing screen with each step.
const steps: { heading: string; text: string; screen: string; side?: string; icon?: IconName }[] = [
  {
    heading: 'Analyse the script.',
    text: 'Every scene, every character, who’s in which. Pulled from the script in seconds, and the file itself never leaves your device.',
    screen: 'Script found',
    icon: 'lock',
  },
  {
    heading: 'Break it down.',
    text: 'References pinned to every character and scene, and the inventory behind them, photographed and ready to pack.',
    screen: 'Character',
    side: 'Scene',
  },
  {
    heading: 'Run the day.',
    text: 'Coordinate shoot days, see what every scene needs, and capture continuity on set.',
    screen: 'Today',
    side: 'Team',
  },
]

/** The steps whose `side` screens the second phone shows, in order. */
const sideSteps = steps.filter((s) => s.side)
const firstSideStep = steps.findIndex((s) => s.side)

// The screens a phone swipes through at the end of the page (the gallery,
// shown instead of the scroll story on a phone), in the order of a day.
const gallery: { screen: string; caption: string }[] = [
  { screen: 'Home', caption: 'Today' },
  { screen: 'Script found', caption: 'Script analysis' },
  { screen: 'Character', caption: 'A character' },
  { screen: 'Scene', caption: 'A scene' },
  { screen: 'Today', caption: 'Shoot day' },
  { screen: 'Team', caption: 'The team' },
]

const privacy: { icon: IconName; heading: string; text: string }[] = [
  { icon: 'phone', heading: 'Read on your device.', text: 'The script file is never uploaded, only the scene and character metadata you choose to submit.' },
  { icon: 'lock', heading: 'Locked to you.', text: 'A PIN and Face ID, with screen protection for productions that need it.' },
  { icon: 'eyeoff', heading: 'No ads, no tracking.', text: 'Your production is private to your team.' },
]

// The departments in a row of large type, the chosen one in ink and the rest
// faded, with its line beneath.
const departments: { name: string; line: string }[] = [
  { name: 'Costume', line: 'Changes, fittings and continuity for every character.' },
  { name: 'Props', line: 'Every piece, where it’s used and where it lives.' },
  { name: 'Hair', line: 'Styles and references, scene by scene.' },
  { name: 'Makeup', line: 'Looks, continuity photos and notes, ready for every call.' },
  { name: 'Set', line: 'Dressing and continuity for every set, scene by scene.' },
]

function Pill({ href, label, children }: { href: string; label?: string; children: string }) {
  return (
    <a className="pill" href={href} aria-label={label}>
      {children} <Icon name="chevron" />
    </a>
  )
}

// Which step sits in the middle of the screen. The phone shows its screen.
function useActiveStep() {
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    for (const el of refs.current) if (el) io.observe(el)
    return () => io.disconnect()
  }, [])
  return { active, refs }
}

// The screenshots captured so far, by the screen name the steps use; the
// rest show a labelled placeholder until they are taken.
const captured: Record<string, string> = {
  Home: '/screens/today.webp',
  'Script found': '/screens/script.webp',
  Character: '/screens/character.webp',
  Scene: '/screens/scene.webp',
  Today: '/screens/shootday.webp',
  Team: '/screens/team.webp',
}

// The app on a phone: one screen per step, crossfading as the steps scroll
// past.
function Phone({
  shots,
  active = 0,
  className = 'phone',
  from,
}: {
  shots: string[]
  active?: number
  className?: string
  /** For the second phone: the index of the step its first screen belongs to. */
  from?: number
}) {
  return (
    <div className={className} data-from={from} role="img" aria-label="The StageRoll app on a phone">
      <div className="screen">
        {shots.map((label, i) => {
          const src = captured[label]
          return (
            <div key={i} className={`scr${src ? ' shot' : ''}${i === active ? ' on' : ''}`}>
              {src ? <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} /> : `${label} screenshot`}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Home() {
  const { active, refs } = useActiveStep()
  const [dept, setDept] = useState(0)
  useStoryMotion()
  return (
    <>
      {/* The hero and How it works are one story: on a wide screen with motion
          allowed it is pinned while the phone travels from the hero into the
          steps, and the features page slides up over its last frame
          (storyMotion.ts); otherwise they are two sections, one after the
          other. */}
      <div className="story">
        <section className="hero">
          <div className="glow" aria-hidden="true" />
          <div className="hero-copy">
            <h1>
              <span className="load-line">Production management,</span>
              <span className="load-line">done right.</span>
            </h1>
            <div className="load-copy">
              <p>Continuity management for productions of any size, from research and physical inventory through to wrap.</p>
              <StoreBadges light />
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <div className="hero-card c1">
              <Photo slot="set" eager />
            </div>
            <div className="hero-card c2">
              <Photo slot="hair" eager />
            </div>
            <div className="hero-card c3">
              <Photo slot="costume" eager />
            </div>
            <div className="hero-card c4">
              <Photo slot="makeup" eager />
            </div>
            <Phone shots={['Home', ...steps.map((s) => s.screen)]} />
            {/* The second phone, with the steps' side screens. Only the scroll
                story shows it (storyMotion.ts, from data-from). */}
            {sideSteps.length > 0 && (
              <Phone shots={sideSteps.map((s) => s.side as string)} className="phone phone2" from={firstSideStep} />
            )}
          </div>
        </section>

        <section className="how tint" aria-labelledby="how-title">
          <div className="wrap">
            <div className="how-head">
              <p className="k">
                <Icon name="phone" />
                Mobile
              </p>
              <h2 id="how-title">Modern by design.</h2>
              <p className="lede">Take photos, scan labels and check the day’s scenes from the phone or tablet already in your pocket.</p>
            </div>
            <div className="how-g">
              <div className="how-phone">
                <Phone shots={steps.map((s) => s.screen)} active={active} />
              </div>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li
                    key={s.heading}
                    data-step={i}
                    className={i === active ? 'on' : undefined}
                    ref={(el) => {
                      refs.current[i] = el
                    }}
                  >
                    <span className="n">0{i + 1}</span>
                    <h3>
                      {s.icon && <Icon name={s.icon} className="step-icon" />}
                      {s.heading}
                    </h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

      </div>

      <section className="features" aria-label="What StageRoll does">
        <div className="wrap">
          <div className="flist">
            {features.map((feature) => (
              <article className="feature" key={feature.heading}>
                <div className="f-title">
                  <p className="k">
                    <Icon name={feature.icon} />
                    {feature.eyebrow}
                  </p>
                  <h2>{feature.heading}</h2>
                </div>
                <ul className="pts">
                  {feature.points.map((point) => (
                    <li key={point.text}>
                      <Icon name={point.icon} />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="more">
            <Pill href="/product/">See everything StageRoll does</Pill>
          </div>
        </div>
      </section>

      <section className="private tint">
        <div className="wrap reveal">
          <h2>Private by default.</h2>
          <ul className="trio">
            {privacy.map((p) => (
              <li key={p.heading}>
                <Icon name={p.icon} />
                <h3>{p.heading}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="depts">
        <div className="wrap">
          <div className="reveal">
            <h2>Made for your department</h2>
            <p className="lede">
              One production for costume, props, hair, makeup and set. Everyone works in their own department’s
              view, and changes reach the whole team straight away.
            </p>
          </div>
          <div className="pick reveal">
            <ul className="pick-names">
              {departments.map((d, i) => (
                <li key={d.name}>
                  <button
                    type="button"
                    className={i === dept ? 'on' : undefined}
                    aria-pressed={i === dept}
                    onClick={() => setDept(i)}
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="pick-line">{departments[dept]?.line}</p>
          </div>
        </div>
      </section>

      {/* On a phone, where the scroll story and its steps are not shown, the
          app's screens come as a row of phones to swipe through, after the
          features have said what they are. */}
      <section className="gallery tint" aria-labelledby="gallery-title">
        <div className="wrap">
          <div className="reveal">
            <p className="k">
              <Icon name="phone" />
              Mobile
            </p>
            <h2 id="gallery-title">Modern by design.</h2>
            <p className="lede">Take photos, scan labels and check the day’s scenes from the phone already in your pocket.</p>
          </div>
        </div>
        <div className="gallery-row">
          {gallery.map((g) => (
            <figure key={g.screen}>
              <Phone shots={[g.screen]} className="phone small" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

// The closing band, inside the footer's frame (routes.tsx `End`).
export function HomeEnd() {
  return (
    <section className="close" id="get">
      <div className="glow" aria-hidden="true" />
      <div className="wrap reveal">
        <h2>Your next production, sorted.</h2>
        <p>One production, every department, from research to wrap.</p>
        <StoreBadges light />
      </div>
    </section>
  )
}
