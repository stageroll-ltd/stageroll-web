import type { ReactNode } from 'react'

import { useMotion } from './motion'

export const company = {
  name: 'StageRoll Ltd',
  number: '17436723',
  email: 'hello@stageroll.co',
  address: ['124-128 City Road', 'London', 'EC1V 2NX', 'United Kingdom'],
}

// The header nav, also the footer's first column. Support is the contact page.
const nav = [
  { href: '/', label: 'Home' },
  { href: '/product/', label: 'Product' },
  { href: '/pricing/', label: 'Pricing' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Support' },
]

// The header sits straight on the page: the logo left, the links centred, Get
// the app right. On the home page it lies over the hero in white (`over`).
// The footer is plain at the bottom of every page: the wordmark, links and
// small print straight on the page. A route's `end` (the home page's closing
// band) is a dark rounded frame above it.
export function Layout({ current, end, children }: { current: string; end?: ReactNode; children: ReactNode }) {
  useMotion()
  const over = current === '/'
  return (
    <>
      <header className={over ? 'nav over' : 'nav'}>
        <a className="brand" href="/" aria-label="StageRoll home">
          <img
            className="wordmark"
            src={over ? '/brand/wordmark-dark.svg' : '/brand/wordmark.svg'}
            width={92}
            height={25}
            alt="StageRoll"
          />
        </a>
        <nav aria-label="Site">
          {nav.map((item) => (
            <a key={item.href} href={item.href} aria-current={item.href === current ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="pill dark get" href="/#get">
          Get the app
        </a>
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
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
            <div>
              <p>Legal</p>
              <a href="/privacy/">Privacy</a>
              <a href="/terms/">Terms</a>
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
