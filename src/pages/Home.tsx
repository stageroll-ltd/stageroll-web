import { Icon, type IconName } from '../components/Icon'
import { Photo } from '../components/Photo'
import { StoreBadges } from '../components/StoreBadges'
import type { PhotoKey } from '../photos'

type Feature = {
  eyebrow: string
  icon: IconName
  heading: string
  points: { icon: IconName; text: string }[]
  photo: PhotoKey
  more: { label: string; href: string }
}

const features: Feature[] = [
  {
    eyebrow: 'Research and inventory',
    icon: 'search',
    heading: 'From research to inventory.',
    points: [
      { icon: 'pin', text: 'Pin references to characters, scenes and sets.' },
      { icon: 'tag', text: 'Turn a reference into an item the moment it’s bought, made or hired.' },
      { icon: 'qr', text: 'Track every item with photos, cost and a label to scan.' },
    ],
    photo: 'board',
    more: { label: 'See how it works', href: '/about/' },
  },
  {
    eyebrow: 'Continuity',
    icon: 'camera',
    heading: 'Every scene, locked.',
    points: [
      { icon: 'list', text: 'Log every change for every character, scene by scene.' },
      { icon: 'camera', text: 'Keep the continuity photos taken on the day with each change.' },
      { icon: 'clock', text: 'See exactly what was worn when a scene comes back.' },
    ],
    photo: 'onset',
    more: { label: 'See how it works', href: '/about/' },
  },
  {
    eyebrow: 'Teams',
    icon: 'users',
    heading: 'Everyone on the same page.',
    points: [
      { icon: 'userplus', text: 'Invite your department and give each person a role.' },
      { icon: 'sync', text: 'Changes show up for the whole team straight away.' },
      { icon: 'layers', text: 'Costume, props, hair and makeup in one production.' },
    ],
    photo: 'seam',
    more: { label: 'See plans', href: '/plans/' },
  },
]

const departments: { name: string; line: string; colour: string; photo: PhotoKey }[] = [
  { name: 'Costume', line: 'Changes, fittings and continuity for every character.', colour: 'var(--ch)', photo: 'fitting' },
  { name: 'Props', line: 'Every piece, where it’s used and where it lives.', colour: 'var(--pr)', photo: 'cases' },
  { name: 'Hair', line: 'Looks and references, scene by scene.', colour: 'var(--hr)', photo: 'hair' },
  { name: 'Makeup', line: 'Continuity photos and notes, ready for every call.', colour: 'var(--mu)', photo: 'makeup' },
]

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="tl" href={href}>
      {children} <Icon name="chevron" />
    </a>
  )
}

export function Home() {
  return (
    <>
      <section className="hero load">
        <div className="slab" aria-hidden="true" />
        <div className="wrap g">
          <div>
            <h1>
              <span className="load-line">Production</span>
              <span className="load-line">management,</span>
              <span className="load-line">
                <em>done right.</em>
              </span>
            </h1>
            <div className="load-copy">
              <p>Continuity management for productions of any size, from research and physical inventory through to wrap.</p>
              <StoreBadges />
            </div>
          </div>
          <div className="row" aria-hidden="true">
            <Photo slot="fitting" />
            <Photo slot="hair" />
            <Photo slot="cases" />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <p>
            From the first reference to the last wrap box.{' '}
            <span>The whole team in sync, scene by scene, from prep to the last day of the shoot.</span>
          </p>
        </div>
      </section>

      <div className="wrap feats">
        {features.map((feature, i) => (
          <section className={i % 2 ? 'feat flip' : 'feat'} key={feature.heading}>
            <div className="pic">
              <Photo slot={feature.photo} />
            </div>
            <div>
              <p className="k">
                <Icon name={feature.icon} />
                {feature.eyebrow}
              </p>
              <h2>{feature.heading}</h2>
              <ul className="pts">
                {feature.points.map((point) => (
                  <li key={point.text}>
                    <Icon name={point.icon} />
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
              <div className="acts">
                <a className="btn" href="#">Start free</a>
                <TextLink href={feature.more.href}>{feature.more.label}</TextLink>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mob">
        <div className="wrap g">
          <div>
            <p className="k">
              <Icon name="phone" />
              Mobile
            </p>
            <h2>Modern by design.</h2>
            <p>
              Take photos, scan labels and check the day’s scenes from the phone or tablet already in your pocket.
              Download it and start free today.
            </p>
            <StoreBadges />
          </div>
          <div className="ph" role="img" aria-label="The app on a phone and a tablet">
            Phone and tablet, side by side
          </div>
        </div>
      </section>

      <section className="depts wrap">
        <h2>Made for your department</h2>
        <div className="dgrid">
          {departments.map((d) => (
            <a className="d" href="/about/" key={d.name} style={{ ['--c' as string]: d.colour }}>
              <Photo slot={d.photo} />
              <span>
                <b>{d.name}</b>
                <i>{d.line}</i>
              </span>
            </a>
          ))}
        </div>
      </section>

      <div className="wrap">
        <section className="early">
          <div>
            <h3>Be one of our first productions</h3>
            <p>We’re working closely with our first teams. Tell us what your department needs and help shape what we build next.</p>
          </div>
          <TextLink href="/contact/">Get in touch</TextLink>
        </section>
        <p className="price">
          Free for your first production. Paid plans per production.
          <a href="/plans/">See plans</a>
        </p>
      </div>

      <section className="close">
        <div className="wrap">
          <h2>Your next production, sorted.</h2>
          <p>Private to your team. No ads, no tracking.</p>
          <StoreBadges light />
        </div>
      </section>
    </>
  )
}
