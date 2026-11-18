import type { CSSProperties } from 'react'

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

// The drawings were made as their pages' openings, each on a canvas 420 by
// 200 (the rings 320), and they fill it differently: one runs edge to edge,
// another sits small in the middle. Side by side in the smaller cells they
// are shown as a set: every one in the same frame (TALL high, so the names
// under them stand on one line), its ink starting at the cell's left edge
// where the words start, and sized so each covers about the same area
// (AREA), never wider than WIDE or taller than the frame.
// What is measured is the ink, not the canvas: the x, y, width and height of
// everything drawn, then the canvas's width. `svg.getBBox()` in the browser
// gives the first four; measure again when a drawing changes.
const ink: Record<string, [x: number, y: number, width: number, height: number, canvas: number]> = {
  script: [40, 24, 350, 152, 420],
  scenes: [0, 62, 420, 114, 420],
  research: [40, 26, 338, 148, 420],
  scanning: [52, 38, 316, 128, 420],
  schedule: [83, 24, 258, 152, 420],
  reports: [127, 16.5, 166, 169, 420],
  team: [69, 11, 282, 167, 420],
  privacy: [10, 8, 300, 184, 320],
}
const AREA = 9600
const WIDE = 180
const TALL = 84

/** Where a drawing stands in its frame and how wide its canvas is drawn (product.css, `.pov-art`). */
function framed(slug: string): CSSProperties | undefined {
  const bounds = ink[slug]
  if (!bounds) return undefined
  const [x, y, width, height, canvas] = bounds
  const scale = Math.min(Math.sqrt(AREA / (width * height)), WIDE / width, TALL / height)
  const px = (v: number) => `${Math.round(v * 10) / 10}px`
  return { '--w': px(canvas * scale), '--x': px(-x * scale), '--y': px((TALL - height * scale) / 2 - y * scale) } as CSSProperties
}

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
                <span className="pov-art" style={framed(area.slug)}>
                  {shows[area.slug]?.art}
                </span>
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
