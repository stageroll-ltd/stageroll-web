import type { CSSProperties } from 'react'

import { departmentPages } from '../pages/departments'
import { Icon } from './Icon'

// The departments as a ruled row of five cells, rail to rail, on the home
// page and the product overview (home.css, `.hm-depts`). Each cell carries
// one of the sunset's five colours, in the order of the home page's bands:
// a rule along its top, and the whole cell under the pointer.

export const departments: { name: string; slug: string; tone: 'deep' | 'mid' | 'top' | 'ember' | 'glow'; line: string }[] = [
  { name: 'Costume', slug: 'costume', tone: 'deep', line: 'Changes, fittings and continuity for every character.' },
  { name: 'Props', slug: 'props', tone: 'mid', line: 'Every piece, where it’s used and where it lives.' },
  { name: 'Hair', slug: 'hair', tone: 'top', line: 'Styles and references, scene by scene.' },
  { name: 'Makeup', slug: 'makeup', tone: 'ember', line: 'Looks, continuity photos and notes, ready for every call.' },
  { name: 'Set', slug: 'sets', tone: 'glow', line: 'Dressing and continuity for every set, scene by scene.' },
]

/** A department's own page (pages/departments.ts), or the overview if it has none. */
const href = (slug: string) => (departmentPages.some((page) => page.slug === slug) ? `/departments/${slug}/` : '/product/')

export function DepartmentCells() {
  return (
    <section className="hm-depts" aria-labelledby="hm-depts">
      <div className="hm-col hm-inset">
        <h2 id="hm-depts" className="hm-lead-in">
          See it for your department
        </h2>
      </div>
      <ul className="hm-col">
        {departments.map((d) => (
          <li key={d.name} style={{ '--tone': `var(--hm-${d.tone})` } as CSSProperties}>
            <a href={href(d.slug)}>
              <h3>
                {d.name} <Icon name="chevron" />
              </h3>
              <p>{d.line}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
