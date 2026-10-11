import type { ComponentType } from 'react'

import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Privacy } from './pages/Privacy'
import { Product } from './pages/Product'
import { Terms } from './pages/Terms'

export type Route = {
  /** Always with a trailing slash; '/' for the home page. */
  path: string
  title: string
  description: string
  /** Shown in the header nav; the rest are reached from the footer. */
  nav?: string
  Page: ComponentType
}

export const siteName = 'StageRoll'
export const siteUrl = 'https://stageroll.co'

export const routes: Route[] = [
  {
    path: '/',
    title: 'StageRoll — Production management, done right',
    description:
      'Continuity management for productions of any size, from research and physical inventory through to wrap.',
    Page: Home,
  },
  {
    path: '/product/',
    title: 'Product — StageRoll',
    description:
      'What is in StageRoll: script reading, scenes, continuity, inventory, the schedule, research, reports, search and team, on the phone.',
    nav: 'Product',
    Page: Product,
  },
  {
    path: '/about/',
    title: 'About — StageRoll',
    description:
      'StageRoll Ltd is an independent software company registered in England and Wales, making production management software for the costume, props, hair and makeup departments of film and television.',
    nav: 'About',
    Page: About,
  },
  {
    path: '/contact/',
    title: 'Contact — StageRoll',
    description: 'How to reach StageRoll Ltd: email, postal address and company details.',
    nav: 'Contact',
    Page: Contact,
  },
  {
    path: '/privacy/',
    title: 'Privacy policy — StageRoll',
    description: 'How StageRoll Ltd collects, uses and protects personal data in the StageRoll app and on this website.',
    Page: Privacy,
  },
  {
    path: '/terms/',
    title: 'Terms of service — StageRoll',
    description: 'The terms on which StageRoll Ltd provides the StageRoll app.',
    Page: Terms,
  },
]

export const notFound: Route = {
  path: '/404/',
  title: 'Page not found — StageRoll',
  description: 'That page does not exist.',
  Page: NotFound,
}

/** '/about' and '/about/' are the same page; '/index.html' is the home page. */
export function normalisePath(pathname: string): string {
  let path = pathname.replace(/index\.html$/, '')
  if (!path.endsWith('/')) path += '/'
  return path
}

export function findRoute(pathname: string): Route {
  const path = normalisePath(pathname)
  return routes.find((route) => route.path === path) ?? notFound
}
