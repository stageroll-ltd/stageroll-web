import { useEffect, useState, type ReactNode } from 'react'

import { accountPages, signedIn } from './account/pages'
import { useMotion } from './motion'

export const company = {
  name: 'StageRoll Ltd',
  number: '17436723',
  email: 'hello@stageroll.co',
  address: ['124-128 City Road', 'London', 'EC1V 2NX', 'United Kingdom'],
}

// The header nav, also the footer's first column. Support is the contact page.
// `sells` is hidden when the app opened the page (styles.css, `.sells`).
const nav: { href: string; label: string; sells?: boolean }[] = [
  { href: '/', label: 'Home' },
  { href: '/product/', label: 'Product' },
  { href: '/pricing/', label: 'Pricing', sells: true },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Support' },
]

// The header sits straight on the page: the logo left, the links centred.
// On the home page it lies over the hero in white (`over`).
// On a phone the links fold into a menu behind a burger (styles.css).
// The footer is plain at the bottom of every page: the wordmark, links and
// small print straight on the page. A route's `end` (the home page's closing
// band) is a dark rounded frame above it.
/** A header link is the page itself, or the section a sub-page sits in (Product for /product/script/). */
function here(href: string, current: string): 'page' | 'true' | undefined {
  if (href === current) return 'page'
  if (href !== '/' && current.startsWith(href)) return 'true'
  return undefined
}

/**
 * The header's way into the account: Sign in, or Your productions once this
 * browser keeps a session that has passed the password. Read after the page
 * has hydrated, from the session supabase-js keeps (`account/keys.ts`), so
 * no page loads Supabase for it. The productions pages start on its own name.
 * Null in a build without the account pages (`account/pages.ts`): the header
 * then has no link, and the nav links, centred absolutely, stay where they are.
 */
function useAccountLink(current: string): { href: string; label: string } | null {
  const [inside, setInside] = useState(current.startsWith('/productions/'))
  useEffect(() => {
    if (accountPages) setInside(signedIn())
  }, [])
  if (!accountPages) return null
  return inside ? { href: '/productions/', label: 'Your productions' } : { href: '/sign-in/', label: 'Sign in' }
}

export function Layout({ current, end, children }: { current: string; end?: ReactNode; children: ReactNode }) {
  useMotion()
  const account = useAccountLink(current)
  const over = current === '/'
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])
  // The header stays put and turns to glass once the page has scrolled a
  // little way (styles.css); `scrolled` is what it keys off.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const cls = ['nav', over && 'over', scrolled && 'scrolled'].filter(Boolean).join(' ')
  return (
    <>
      <header className={cls}>
        <a className="brand" href="/" aria-label="StageRoll home">
          {/* Both wordmarks, ink and white; CSS shows the one for the ground. */}
          <img className="wordmark wm-ink" src="/brand/wordmark.svg" width={92} height={25} alt="StageRoll" />
          <img className="wordmark wm-white" src="/brand/wordmark-dark.svg" width={92} height={25} alt="" />
        </a>
        <nav id="site-nav" aria-label="Site" className={menu ? 'open' : undefined}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.sells ? 'sells' : undefined}
              aria-current={here(item.href, current)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          {account && (
            <a
              className="nav-account sells"
              href={account.href}
              aria-current={account.href === current ? 'page' : undefined}
            >
              {account.label}
            </a>
          )}
          <button
            type="button"
            className="burger"
            aria-label={menu ? 'Close menu' : 'Menu'}
            aria-expanded={menu}
            aria-controls="site-nav"
            onClick={() => setMenu((m) => !m)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>{children}</main>

      {end && <div className="end lit">{end}</div>}
      <footer className="foot">
        <div className="foot-top">
          <div>
            <img className="wordmark" src="/brand/wordmark.svg" width={120} height={33} alt="StageRoll" />
            <p>Production management, done right.</p>
          </div>
          <nav aria-label="Footer">
            <div>
              <p>StageRoll</p>
              {nav.map((item) => (
                <a key={item.href} href={item.href} className={item.sells ? 'sells' : undefined}>
                  {item.label}
                </a>
              ))}
              <a href="/help/">Help</a>
            </div>
            <div>
              <p>Legal</p>
              <a href="/privacy/">Privacy</a>
              <a href="/terms/">Terms</a>
            </div>
            <div>
              <p>Contact</p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <address>
                {company.name}
                <br />
                {company.address.slice(0, 3).join(', ')}
              </address>
            </div>
          </nav>
        </div>
        <p className="foot-small">
          © 2026 {company.name}. Registered in England and Wales, company no. {company.number}.{' '}
          {company.address.slice(0, 3).join(', ')}.
        </p>
      </footer>
    </>
  )
}
