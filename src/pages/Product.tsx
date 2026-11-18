import { DepartmentCells } from '../components/DepartmentCells'
import { Icon } from '../components/Icon'
import { PageClose } from '../components/Page'
import { featurePages, type FeaturePage } from './features'
import { useDrawIn } from './Showcase'
import { Draw, shows } from './shows'

// The product overview, a landing page for the feature pages under /product/
// (features.ts), in the hand of those pages (product.css, `.sec-` and
// `.pov-`): a centred opening over a line drawing, then ruled cells from
// rail to rail, each with its page's own drawing. Continuity and inventory
// lead as two large cells, side by side, because StageRoll is built with
// them as equals; every other area follows as a smaller cell. Then the
// departments, as on the home page.

const leading = ['continuity', 'inventory']

const page = (slug: string): FeaturePage => {
  const found = featurePages.find((p) => p.slug === slug)
  if (!found) throw new Error(`No feature page for ${slug}`)
  return found
}

const lead = leading.map(page)
const rest = featurePages.filter((p) => !leading.includes(p.slug))

export function Product() {
  const hero = useDrawIn()
  return (
    <div className="prod hm fr sec pov">
      <section ref={hero} className="sec-hero">
        <div className="hm-col">
          <Draw of="product" />
          <h1>Everything your department runs on.</h1>
          <p className="lede">
            Built with continuity and inventory as equals, and the script, research, schedule and paperwork around
            them, in one film or TV production every department shares.
          </p>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="pov-lead">
        <div className="hm-col fr-in">
          <h2 id="pov-lead">Continuity and inventory, built as equals.</h2>
        </div>
        <ul className="hm-col pov-lead">
          {lead.map((area) => (
            <li key={area.slug}>
              <a href={`/product/${area.slug}/`}>
                {shows[area.slug]?.art}
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <ul>
                  {area.features.slice(0, 3).map(([feature]) => (
                    <li key={feature}>
                      <Icon name="check" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="pov-go">
                  Explore {area.title.toLowerCase()} <Icon name="chevron" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="sec-band" aria-labelledby="pov-rest">
        <div className="hm-col fr-in">
          <h2 id="pov-rest">And everything around them.</h2>
        </div>
        <ul className="hm-col pov-rest">
          {rest.map((area) => (
            <li key={area.slug}>
              <a href={`/product/${area.slug}/`}>
                {shows[area.slug]?.art}
                <h3>
                  {area.title} <Icon name="chevron" />
                </h3>
                <p>{area.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <DepartmentCells />

      <PageClose id="next-title" />
    </div>
  )
}
