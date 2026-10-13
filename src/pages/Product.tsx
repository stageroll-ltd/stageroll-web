import { Icon } from '../components/Icon'
import { featurePages, type FeaturePage } from './features'

// The product overview, a landing page for the feature pages under /product/
// (features.ts). Continuity and inventory lead as two large cards, side by
// side, because StageRoll is built with them as equals; every other area
// follows as a smaller card. Each card goes to its area's page.

const departments: { name: string; line: string }[] = [
  { name: 'Costume', line: 'Changes and what’s in them' },
  { name: 'Props', line: 'Who carries what, scene by scene' },
  { name: 'Hair', line: 'Styles and their pieces' },
  { name: 'Makeup', line: 'Looks and their pieces' },
  { name: 'Sets', line: 'Every set and how it’s dressed' },
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
    <div className="prod">
      <section className="prod-hero">
        <div className="wrap">
          <h1>Everything your department runs on.</h1>
          <p className="lede">
            Built with continuity and inventory as equals, and the script, research, schedule and paperwork around
            them, in one production every department shares.
          </p>
          <ul className="prod-depts" aria-label="Departments">
            {departments.map((d) => (
              <li key={d.name}>
                <b>{d.name}</b>
                <span>{d.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="prod-areas" aria-label="What StageRoll does">
        <div className="wrap">
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

      <section className="prod-sec tint prod-end" aria-labelledby="next-title">
        <div className="wrap">
          <div className="prod-center reveal">
            <h2 id="next-title">Ready for your next production.</h2>
            <p className="lede">Plans are per production, and every crew account is free.</p>
            <div className="acts">
              <a className="pill dark" href="/pricing/">
                See pricing
              </a>
              <a className="pill" href="/contact/">
                Get in touch <Icon name="chevron" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
