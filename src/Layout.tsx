import type { ReactNode } from 'react'

import { Wordmark } from './components/Wordmark'
import { useMotion } from './motion'

export const company = {
  name: 'StageRoll Ltd',
  number: '17436723',
  email: 'hello@stageroll.co',
  address: ['124-128 City Road', 'London', 'EC1V 2NX', 'United Kingdom'],
}

// The header nav. Support is the contact page; Plans does not exist yet.
const nav = [
  { href: '/about/', label: 'About' },
  { href: '/plans/', label: 'Plans' },
  { href: '/contact/', label: 'Support' },
]

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  useMotion()
  return (
    <>
      <header className="nav wrap">
        <a className="brand" href="/" aria-label="StageRoll home">
          <Wordmark />
        </a>
        <nav aria-label="Site">
          {nav.map((item) => (
            <a key={item.href} href={item.href} aria-current={item.href === current ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="foot">
        <div className="wrap">
          <span>
            © 2026 {company.name}. Registered in England and Wales, company no. {company.number}.{' '}
            {company.address.slice(0, 3).join(', ')}.
          </span>
          <nav aria-label="Legal">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">Terms</a>
            <a href="/contact/">Support</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
