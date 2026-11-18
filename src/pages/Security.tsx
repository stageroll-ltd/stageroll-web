import { Icon, type IconName } from '../components/Icon'
import { PageClose } from '../components/Page'
import type { FeaturePage } from './features'

// The privacy and security page under /product/ (features.ts, `privacy`),
// told as its own page: a centred opening over a drawing, the approach in
// two columns, the principles as a list beside a drawing, then every
// safeguard in a ruled grid. Each band is ruled off from the next, in the
// page's column (product.css, `.sec-`). Every claim here is one the feature
// page already made; the safeguards are its `features`, word for word.

const approach = [
  'Productions hold unreleased scripts and private work. So StageRoll reads the script on your phone, and the file is never uploaded: only the scene list and the cast are kept.',
  'Everything else in a production, its scenes, records and photos, is shown only to the people on it. Your work is never sold, used for advertising or used to train AI.',
]

const principles: [name: string, text: string, icon: IconName][] = [
  ['On your device', 'The script is read where you are, not on a server.', 'doc'],
  ['Members only', 'A production is shown only to the people on it.', 'users'],
  ['Locked when you leave', 'A PIN or Face ID, and it locks itself when you step away.', 'shield'],
  ['Yours to sign out', 'Every signed-in device is listed, and any of them can be signed out.', 'phone'],
  ['Never sold', 'No advertising, no selling, no training AI on your work.', 'eyeoff'],
]

/** Fine rings in the sunset's colours round a padlock: the opening's drawing. */
function Rings() {
  return (
    <svg className="sec-rings" viewBox="0 0 320 200" aria-hidden="true">
      <ellipse className="deep" cx="160" cy="100" rx="150" ry="56" />
      <ellipse className="mid" cx="160" cy="100" rx="118" ry="70" />
      <ellipse className="top" cx="160" cy="100" rx="86" ry="84" />
      <ellipse className="glow" cx="160" cy="100" rx="56" ry="92" />
      <rect className="ink" x="136" y="92" width="48" height="40" rx="7" />
      <path className="ink" d="M146 92V80a14 14 0 0 1 28 0v12M160 108v8" />
    </svg>
  )
}

/** A phone with a script inside it, and a ring the script never crosses. */
function Kept() {
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

export function Security({ page }: { page: FeaturePage }) {
  return (
    <div className="prod hm fr sec">
      <section className="sec-hero">
        <div className="hm-col">
          <Rings />
          <p className="hm-kicker">
            <a href="/product/">Product</a>
          </p>
          <h1>{page.title}</h1>
          <p className="lede">{page.lede}</p>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="sec-approach">
        <div className="hm-col fr-in">
          <h2 id="sec-approach">Our approach</h2>
          <div className="sec-two">
            {approach.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="sec-principles">
        <div className="hm-col fr-in">
          <h2 id="sec-principles">Our principles</h2>
          <div className="sec-split">
            <ul className="sec-principles">
              {principles.map(([name, text, icon]) => (
                <li key={name}>
                  <Icon name={icon} />
                  <h3>{name}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
            <Kept />
          </div>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="sec-safeguards">
        <div className="hm-col fr-in">
          <h2 id="sec-safeguards">Our safeguards</h2>
        </div>
        {/* Every safeguard, in ruled cells from rail to rail. */}
        <ul className="hm-col sec-grid">
          {page.features.map(([lead, text, icon]) => (
            <li key={lead}>
              <Icon name={icon} />
              <h3>{lead}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        {page.more && (
          <div className="hm-col fr-in sec-more">
            <a className="hm-btn" href={page.more.href}>
              {page.more.label} <Icon name="chevron" />
            </a>
          </div>
        )}
      </section>

      <PageClose id="sec-next" />
    </div>
  )
}
