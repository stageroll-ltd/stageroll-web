import type { ComponentType } from 'react'

import { accountRoutes } from './account/pages'
import { company } from './Layout'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Home, HomeEnd } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Pricing } from './pages/Pricing'
import { Privacy } from './pages/Privacy'
import { Product } from './pages/Product'
import { Feature } from './pages/Feature'
import { Help } from './pages/Help'
import { Department } from './pages/Department'
import { departmentPages } from './pages/departments'
import { featurePages, type FeaturePage } from './pages/features'
import { Showcase } from './pages/Showcase'
import { shows } from './pages/shows'
import { Terms } from './pages/Terms'

export type Route = {
  /** Always with a trailing slash; '/' for the home page. */
  path: string
  title: string
  description: string
  /** Shown in the header nav; the rest are reached from the footer. */
  nav?: string
  Page: ComponentType
  /** A band inside the footer's frame, above the footer card: the home page's closing photograph. */
  End?: ComponentType
  /** Kept out of search results and the sitemap: the account pages and the 404 page. */
  noindex?: boolean
  /**
   * The sitemap's lastmod (YYYY-MM-DD): the day the page's words, title,
   * description, links or structured data last changed. Bump it in the same
   * commit as any such change, and never for styling or refactoring alone:
   * Google uses lastmod only while it stays accurate.
   */
  updated?: string
  /** Structured data for the page, written into its head (scripts/head.ts). */
  jsonLd?: object[]
}

export const siteName = 'StageRoll'
export const siteUrl = 'https://stageroll.co'

// Who runs the site, for search engines: on the home page, where Google reads
// the site's name (WebSite) and the company behind it (Organization). Its
// name is the site's name, StageRoll; the registered name is legalName.
// sameAs lists only profiles the company holds: add the App Store and Google
// Play listings, and any company page, the day each exists.
const website = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      alternateName: 'stageroll.co',
      url: `${siteUrl}/`,
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      alternateName: 'stageroll.co',
      legalName: company.name,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/brand/wordmark.svg`,
      email: company.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address[0],
        addressLocality: company.address[1],
        postalCode: company.address[2],
        addressCountry: 'GB',
      },
      sameAs: [
        `https://find-and-update.company-information.service.gov.uk/company/${company.number}`,
        'https://github.com/stageroll-ltd',
      ],
    },
  ],
}

// A feature or department page's route: its title, its sitemap date and the
// trail the page shows above its heading (Product, then the page).
const docRoute = (base: string, page: FeaturePage): Route => ({
  path: `${base}${page.slug}/`,
  title: `${page.metaTitle ?? page.title} — StageRoll`,
  description: page.description,
  Page: () => <Feature page={page} />,
  updated: page.updated,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Product',
          item: `${siteUrl}/product/`,
        },
        { '@type': 'ListItem', position: 2, name: page.title },
      ],
    },
  ],
})

export const routes: Route[] = [
  {
    path: '/',
    title: 'StageRoll — Continuity and inventory app for film and TV',
    description:
      'StageRoll keeps continuity and inventory for costume, props, hair, makeup and sets on film and TV productions. Built for iPhone, iPad and Android.',
    Page: Home,
    End: HomeEnd,
    updated: '2026-11-18',
    jsonLd: [website],
  },
  {
    path: '/product/',
    title: 'Features for costume, props, hair, makeup and sets — StageRoll',
    description:
      'Everything StageRoll does for film and TV departments: script analysis, scenes, continuity, research, inventory, QR codes, the schedule, reports and team.',
    nav: 'Product',
    Page: Product,
    updated: '2026-11-17',
  },
  // The feature pages, one per area of the overview (pages/features.ts).
  ...featurePages.map((page): Route => {
    const route = docRoute('/product/', page)
    // Every feature page is told in ruled bands (shows.tsx); one without a show would be a plain document.
    const show = shows[page.slug]
    if (!show) return route
    return {
      ...route,
      Page: () => (
        <Showcase
          kicker={<a href="/product/">Product</a>}
          title={page.title}
          lede={page.lede}
          show={show}
          links={page.related}
          plan={page.plan}
          more={page.more}
        />
      ),
    }
  }),
  // The department pages, one per craft (pages/departments.ts), reached
  // from the overview's department cards.
  ...departmentPages.map((page): Route => {
    const route = docRoute('/departments/', page)
    const { story } = page
    // A page told as a story is a landing page; the rest are still documents.
    return story ? { ...route, Page: () => <Department page={page} story={story} /> } : route
  }),
  {
    path: '/pricing/',
    title: 'Pricing per production, crew accounts free — StageRoll',
    description:
      'StageRoll is priced per production, not per person: Free, Starter, Pro and Enterprise plans, every department included. Crew accounts are always free.',
    nav: 'Pricing',
    Page: Pricing,
    updated: '2026-11-17',
  },
  {
    path: '/about/',
    title: 'About StageRoll — software for film and TV departments',
    description:
      'StageRoll Ltd is an independent software company registered in England and Wales, making continuity and inventory software for film and TV departments.',
    nav: 'About',
    Page: About,
    updated: '2026-11-18',
  },
  {
    path: '/help/',
    title: 'StageRoll help — teams, plans, passwords and scripts',
    description:
      'How to join or upgrade a production, change or reset your password, sign out a lost device, restore a deleted production and delete your StageRoll account.',
    Page: Help,
    updated: '2026-11-13',
  },
  {
    path: '/contact/',
    title: 'Contact StageRoll — email, post and company details',
    description: 'How to reach StageRoll Ltd: email, postal address and company details.',
    nav: 'Contact',
    Page: Contact,
    updated: '2026-11-13',
  },
  {
    path: '/privacy/',
    title: 'Privacy policy — StageRoll',
    description:
      'How StageRoll Ltd collects, uses and protects personal data in the StageRoll app and on this website.',
    Page: Privacy,
    // The policy's own "Last updated" date (Privacy.tsx): keep the two in step.
    updated: '2026-10-30',
  },
  {
    path: '/terms/',
    title: 'Terms of service — StageRoll',
    description: 'The terms on which StageRoll Ltd provides the StageRoll app.',
    Page: Terms,
    // The terms' own "Last updated" date (Terms.tsx): keep the two in step.
    updated: '2026-10-30',
  },
  // The account pages (account/pages.ts), in a build that has them; the
  // header links to them (Layout.tsx). Elsewhere this adds nothing and the
  // deployed site answers their paths with the 404 page.
  ...accountRoutes(),
]

export const notFound: Route = {
  path: '/404/',
  title: 'Page not found — StageRoll',
  description: 'That page does not exist.',
  Page: NotFound,
  // GitHub Pages answers /404.html itself with a 200, so it says noindex.
  noindex: true,
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
