import { useEffect, useRef, type ReactNode } from 'react'

import { Icon, type IconName } from '../components/Icon'
import { PageClose } from '../components/Page'

// A page told in ruled bands, in the page's column (product.css, `.sec-`):
// a centred opening with a picture, then any of three kinds of band in any
// order. Which bands a page has, their order and what its pictures are make
// the pages kin without making them copies (shows.tsx, About.tsx).

/** How long a page takes to fade in over the last, in milliseconds: the fade's delay and length in styles.css. */
const PAGE_FADE = 560

export type Item = [lead: string, text: ReactNode, icon?: IconName]

export type Band =
  /** A heading over two columns of text. */
  | { kind: 'two'; heading: string; text: ReactNode[] }
  /** A heading over a ruled list, or text, beside a picture. `flip` puts the picture first. */
  | { kind: 'split'; heading: string; items?: Item[]; text?: ReactNode[]; art: ReactNode; flip?: boolean }
  /** A heading over a ruled list in two columns, with no picture. */
  | { kind: 'list'; heading: string; items: Item[] }
  /** A heading over ruled cells from rail to rail, `cols` to a row (four unless said). */
  | { kind: 'grid'; heading: string; items: Item[]; cols?: 3 | 4 | 5 }

export type Show = {
  /** The opening's picture, above the title: a line drawing. */
  art: ReactNode
  bands: Band[]
}

function Items({ items, className }: { items: Item[]; className: string }) {
  return (
    <ul className={className}>
      {items.map(([lead, text, icon]) => (
        <li key={lead}>
          {icon && <Icon name={icon} />}
          <h3>{lead}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ul>
  )
}

export function Showcase({
  kicker,
  title,
  lede,
  show,
  links,
  plan,
  more,
}: {
  kicker?: ReactNode
  title: string
  lede: ReactNode
  show: Show
  /** Other pages on the same ground: a row of buttons after the bands. */
  links?: { href: string; label: string }[]
  /** Says the Free plan exists. Hidden when the app opened the page (`.sells`). */
  plan?: boolean
  more?: { href: string; label: string }
}) {
  // The opening's drawing draws itself when the page loads: each line in
  // turn, a moment after the one before (product.css, `sec-go`). A line's
  // length counts as 1 and its turn is --n, both set here so the drawings
  // themselves stay plain. With no script the drawing is simply there.
  const hero = useRef<HTMLElement>(null)
  useEffect(() => {
    const svg = hero.current?.querySelector('svg')
    if (!svg) return
    svg.querySelectorAll<SVGElement>('path, rect, circle, ellipse').forEach((line, i) => {
      line.setAttribute('pathLength', '1')
      line.style.setProperty('--n', String(i))
    })
    // Arriving from another page of the site, the page fades in over the one
    // before it (styles.css, "Moving between pages"), and the drawing would
    // be part-drawn before it could be seen. So it waits for that to end.
    // A page opened afresh, or reloaded, has no such fade and starts at once.
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const crossed = 'onpagereveal' in window && entry?.type === 'navigate' && document.referrer.startsWith(location.origin)
    const start = window.setTimeout(() => svg.classList.add('sec-go'), crossed ? PAGE_FADE : 0)
    return () => window.clearTimeout(start)
  }, [])
  return (
    <div className="prod hm fr sec">
      <section ref={hero} className="sec-hero">
        <div className="hm-col">
          {show.art}
          {kicker && <p className="hm-kicker">{kicker}</p>}
          <h1>{title}</h1>
          <p className="lede">{lede}</p>
        </div>
      </section>

      {show.bands.map((band) => (
        <section key={band.heading} className="sec-band">
          <div className="hm-col fr-in">
            <h2>{band.heading}</h2>
            {band.kind === 'two' && (
              <div className="sec-two">
                {band.text.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
            {band.kind === 'list' && <Items items={band.items} className="sec-list cols" />}
            {band.kind === 'split' && (
              <div className={band.flip ? 'sec-split flip' : 'sec-split'}>
                {band.items ? (
                  <Items items={band.items} className="sec-list" />
                ) : (
                  <div className="sec-text">{band.text?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
                )}
                <div className="sec-art">{band.art}</div>
              </div>
            )}
          </div>
          {band.kind === 'grid' && <Items items={band.items} className={`hm-col sec-grid${band.cols === 5 ? ' five' : band.cols === 3 ? ' three' : ''}`} />}
        </section>
      ))}

      {(links || plan || more) && (
        <section className="sec-band sec-on">
          <div className="hm-col fr-in">
            {plan && (
              <p className="sells">
                StageRoll has a free plan for working on your own, and crew accounts are always free.{' '}
                <a href="/pricing/">See pricing</a>
              </p>
            )}
            <ul>
              {links?.map((link) => (
                <li key={link.href}>
                  <a className="hm-btn" href={link.href}>
                    {link.label} <Icon name="chevron" />
                  </a>
                </li>
              ))}
              {more && (
                <li>
                  <a className="hm-btn" href={more.href}>
                    {more.label} <Icon name="chevron" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      <PageClose id="sec-next" />
    </div>
  )
}
