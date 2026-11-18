import { Icon } from '../components/Icon'
import { PageClose } from '../components/Page'

// A comparison page under /compare/ (compares.ts), in ruled bands in the
// page's column (product.css, `.sec-` and `.cmp-`): a plain opening, the
// facts side by side in a ruled table with a source for each of the other
// product's, where StageRoll differs, what the other product has that
// StageRoll doesn't, and the small print.
//
// The rules these pages keep (UK CAP Code 3.33 to 3.43, comparisons): every
// fact about the other product is its maker's own, with a link and the day
// it was checked; nothing is claimed that cannot be checked; its name is
// used only as a word, never its logo; and the page says StageRoll is not
// connected with it and is not in the app stores yet.

export type ComparePage = {
  slug: string
  /** The other product, as its maker writes it. */
  rival: string
  title: string
  metaTitle: string
  description: string
  /** The sitemap's lastmod (routes.tsx). */
  updated: string
  /** The day every fact about the other product was checked, as written on the page. */
  checked: string
  lede: string
  /** One fact a row: StageRoll's, the other product's, and where the other's is published. */
  rows: { label: string; ours: string; theirs: string; source?: string }[]
  /** Where StageRoll differs: each a fact of ours beside one of theirs from the table. */
  differs: [lead: string, text: string][]
  /** What the other product has that StageRoll doesn't, in fairness. */
  fair: string[]
}

export function Compare({ page }: { page: ComparePage }) {
  return (
    <div className="prod hm fr sec cmp">
      <section className="sec-hero">
        <div className="hm-col">
          <p className="hm-kicker">Compare</p>
          <h1>{page.title}</h1>
          <p className="lede">{page.lede}</p>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="cmp-facts">
        <div className="hm-col fr-in">
          <h2 id="cmp-facts">Side by side</h2>
        </div>
        <div className="hm-col cmp-scroll">
          <table className="cmp-table">
            <thead>
              <tr>
                <td />
                <th scope="col">StageRoll</th>
                <th scope="col">{page.rival}</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.ours}</td>
                  <td>
                    {row.theirs}
                    {row.source && (
                      <a className="cmp-source" href={row.source} rel="nofollow noopener" target="_blank">
                        Source
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hm-col fr-in">
          <p className="cmp-note">
            {page.rival}’s details are from its maker’s own pages, checked on {page.checked}. Tell us if anything has
            changed and we’ll correct it.
          </p>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="cmp-differs">
        <div className="hm-col fr-in">
          <h2 id="cmp-differs">Where StageRoll differs</h2>
          <ul className="sec-list cols">
            {page.differs.map(([lead, text]) => (
              <li key={lead}>
                <Icon name="check" />
                <h3>{lead}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec-band" aria-labelledby="cmp-fair">
        <div className="hm-col fr-in">
          <h2 id="cmp-fair">What {page.rival} has that StageRoll doesn’t</h2>
          <ul className="cmp-fair">
            {page.fair.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <p className="cmp-note">
            StageRoll is launching on iPhone, iPad and Android and is not in the app stores yet. {page.rival} is a
            trade mark of its owner. StageRoll is not connected with or endorsed by it.
          </p>
        </div>
      </section>

      <PageClose id="cmp-next" />
    </div>
  )
}
