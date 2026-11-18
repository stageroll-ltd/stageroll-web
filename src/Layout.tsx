import { useEffect, useState, type ReactNode } from 'react'

import { accountPages, signedIn } from './account/pages'
import { Icon } from './components/Icon'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from './links'
import { departmentPages } from './pages/departments'
import { featurePages } from './pages/features'

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
// Every page is framed (`framed`, home.css): the header's and footer's
// content kept to the page's column, with a rail at each edge. The home
// page has an announcement above the header too.
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
  const account = useAccountLink(current)
  // Only the home page has the announcement, and it draws its own rails.
  const home = current === '/'
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
  const cls = ['nav', 'framed', scrolled && 'scrolled'].filter(Boolean).join(' ')
  return (
    <>
      {home && (
        <p className="announce">
          {/* Until a store listing exists (links.ts), the app is on its way. */}
          {APP_STORE_URL === '#' && GOOGLE_PLAY_URL === '#' ? 'Launching on' : 'Now on'} iPhone, iPad and Android
          <a href="/product/">
            See the product <Icon name="chevron" />
          </a>
        </p>
      )}
      {/* The column's rails, down the whole page (home.css). */}
      {!home && <div className="hm-rails" aria-hidden="true" />}
      <header className={cls}>
        <a className="brand" href="/" aria-label="StageRoll home">
          {/* Both wordmarks, ink and white; CSS shows the one for the ground. */}
          <img className="wordmark wm-ink" src="/brand/wordmark.svg" width={92} height={25} alt="StageRoll" />
          <img className="wordmark wm-white" src="/brand/wordmark-dark.svg" width={92} height={25} alt="" />
        </a>
        <nav id="site-nav" aria-label="Site" className={menu ? 'open' : undefined}>
          {nav.map((item) => {
            const link = (
              <a
                key={item.href}
                href={item.href}
                className={item.sells ? 'sells' : undefined}
                aria-current={here(item.href, current)}
              >
                {item.label}
              </a>
            )
            // Product opens a panel of its pages on hover or focus, on a
            // wide screen only (styles.css, `.nav-panel`): the departments
            // with a line each, then every feature. The link itself still
            // goes to the overview, which is the way in on a phone.
            if (item.href !== '/product/') return link
            return (
              <span key={item.href} className="nav-item">
                {link}
                <div className="nav-panel">
                  <div className="nav-panel-card">
                    <div className="nav-col">
                      <p>Departments</p>
                      {departmentPages.map((page) => (
                        <a key={page.slug} href={`/departments/${page.slug}/`}>
                          <b>{page.title}</b>
                          <span>{page.summary}</span>
                        </a>
                      ))}
                    </div>
                    <div className="nav-col">
                      <p>Features</p>
                      <div className="nav-feats">
                        {featurePages.map((page) => (
                          <a key={page.slug} href={`/product/${page.slug}/`}>
                            <b>{page.title}</b>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            )
          })}
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

      {end && <div className="end">{end}</div>}
      <footer className="foot framed">
        <div className="foot-top">
          <div>
            <img className="wordmark" src="/brand/wordmark.svg" width={120} height={33} alt="StageRoll" />
            <p>Production management, done right.</p>
          </div>
          {/* The footer is the site's index: every feature and department page, by name. */}
          <nav aria-label="Footer">
            <div>
              <p>Product</p>
              {featurePages.map((page) => (
                <a key={page.slug} href={`/product/${page.slug}/`}>
                  {page.title}
                </a>
              ))}
            </div>
            <div>
              <p>Departments</p>
              {departmentPages.map((page) => (
                <a key={page.slug} href={`/departments/${page.slug}/`}>
                  {page.title}
                </a>
              ))}
            </div>
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
