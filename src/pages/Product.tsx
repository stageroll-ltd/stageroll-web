import { Icon } from '../components/Icon'
import { PageClose } from '../components/Page'
import { featurePages, type FeaturePage } from './features'

// The product overview, a landing page for the feature pages under /product/
// (features.ts). Continuity and inventory lead as two large cards, side by
// side, because StageRoll is built with them as equals; every other area
// follows as a smaller card. Each card goes to its area's page.

// Each department's card goes to its page (departments.ts).
const departments: { name: string; line: string; href: string }[] = [
  {
    name: 'Costume',
    line: 'Changes and what’s in them',
    href: '/departments/costume/',
  },
  {
    name: 'Props',
    line: 'Who carries what, scene by scene',
    href: '/departments/props/',
  },
  { name: 'Hair', line: 'Styles and their pieces', href: '/departments/hair/' },
  {
    name: 'Makeup',
    line: 'Looks and their pieces',
    href: '/departments/makeup/',
  },
  {
    name: 'Sets',
    line: 'Every set and how it’s dressed',
    href: '/departments/sets/',
  },
]

const leading = ['continuity', 'inventory']

const page = (slug: string): FeaturePage => {
  const found = featurePages.find((p) => p.slug === slug)
  if (!found) throw new Error(`No feature page for ${slug}`)
  return found
}

const lead = leading.map(page)
const rest = featurePages.filter((p) => !leading.includes(p.slug))

export function Product() {
  return (
    <div className="prod hm fr">
      {/* The opening: the promise on the left, the five departments as a short list on the right. */}
      <section className="hm-hero fr-split">
        <div className="hm-col hm-hero-in">
          <div>
            <h1>Everything your department runs on.</h1>
            <p className="lede">
              Built with continuity and inventory as equals, and the script, research, schedule and paperwork around
              them, in one film or TV production every department shares.
            </p>
          </div>
          <ul className="fr-depts" aria-label="Departments">
            {departments.map((d) => (
              <li key={d.name}>
                <a href={d.href}>
                  <span>
                    <b>{d.name}</b>
                    {d.line}
                  </span>
                  <Icon name="chevron" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="prod-areas" aria-label="What StageRoll does">
        <div className="hm-col hm-inset">
          <div className="prod-lead">
            {lead.map((area) => (
              <a key={area.slug} className="prod-card big reveal" href={`/product/${area.slug}/`}>
                <Icon name={area.icon} />
                <h2>{area.title}</h2>
                <p>{area.summary}</p>
                <ul>
                  {area.features.slice(0, 3).map(([feature]) => (
                    <li key={feature}>
                      <Icon name="check" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="go">
                  Explore {area.title.toLowerCase()} <Icon name="chevron" />
                </span>
              </a>
            ))}
          </div>

          <div className="prod-grid">
            {rest.map((area) => (
              <a key={area.slug} className="prod-card reveal" href={`/product/${area.slug}/`}>
                <Icon name={area.icon} />
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <span className="go" aria-hidden="true">
                  <Icon name="chevron" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PageClose id="next-title" />
    </div>
  )
}
