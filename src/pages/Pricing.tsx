import { Icon } from '../components/Icon'

// The plans, from the plan table on stageroll-docs #18 (MVP: Role Setup),
// which is the source of truth for prices, seats and limits. The internal
// fair-use caps on that card are never shown here. Rows marked `soon` are
// features still being built; the tag comes off the day each one ships.

type Plan = { name: string; price: string; per: string; who: string; seats: string }

const plans: Plan[] = [
  { name: 'Free', price: '£0', per: 'One production per account', who: 'Trying it on your own', seats: 'Just you' },
  { name: 'Starter', price: '£49', per: 'per production a month', who: 'A small indie or a short production', seats: '5 seats' },
  { name: 'Pro', price: '£299', per: 'per production a month', who: 'Productions with up to 30 crew', seats: '30 seats' },
  { name: 'Enterprise', price: 'Custom', per: 'Priced with you, per production', who: 'Studio productions', seats: '50+ seats' },
]

/** A cell: words (with a quieter line under them), or true for included and false for not. */
type Cell = string | boolean | { text: string; note: string }

type Row = { label: string; cells: [Cell, Cell, Cell, Cell]; soon?: boolean }

const table: { group: string; rows: Row[] }[] = [
  {
    group: 'Team',
    rows: [
      { label: 'Seats', cells: ['1', '5', '30', '50+'] },
      { label: 'Who you can invite', cells: [false, 'Crew', 'Coordinators and crew', 'Coordinators and crew'] },
      { label: 'Role permissions', cells: ['Fixed', 'Fixed', 'Fixed', 'Editable per department'] },
    ],
  },
  {
    group: 'Limits',
    rows: [
      { label: 'Script analyses a month', cells: ['3', '10', 'Unlimited', 'Unlimited'] },
      { label: 'Items', cells: ['100', '500', '3,000', 'Custom'] },
      { label: 'Crates', cells: ['10', '50', '300', 'Custom'] },
      { label: 'Research references', cells: [false, '500', '3,000', 'Custom'] },
      // A photo is stored at three sizes, made on the phone (stageroll-native
      // src/photos/prepare.ts): 2048, 1280 and 512 on the long edge. Photos
      // taken in the app measured about 1 MB for all three (dev project,
      // 2026-10-12: 58 photos, median 0.94 MB, nine in ten under 1.5 MB).
      {
        label: 'Storage for photos',
        cells: [
          { text: '1 GB', note: 'About 1,000 photos' },
          { text: '10 GB', note: 'About 10,000 photos' },
          { text: '100 GB', note: 'About 100,000 photos' },
          'Custom',
        ],
      },
    ],
  },
  {
    group: 'Features',
    rows: [
      { label: 'Every department', cells: [true, true, true, true] },
      { label: 'Several scripts and episodes', cells: [false, false, true, true] },
      { label: 'Reports as spreadsheets (CSV)', cells: [false, false, true, true] },
      { label: 'Production-wide reports', cells: [false, false, true, true], soon: true },
      { label: 'QR labels printed in bulk', cells: [false, false, true, true], soon: true },
      { label: 'Enhanced security', cells: [false, false, true, true], soon: true },
    ],
  },
  {
    group: 'Billing and support',
    rows: [
      { label: 'Billing, monthly', cells: ['Card', 'Card', 'Card', 'Invoice or purchase order'] },
      { label: 'Support', cells: ['Help pages', 'Email', 'Email', 'Priority'] },
    ],
  },
]

const notes = [
  'Crew never pay. Joining someone else’s production doesn’t use up your free one.',
  'Every plan includes every department.',
  'Enterprise limits are set with each production.',
  'Photos are made smaller on your phone before they’re uploaded, to about 1 MB each, so the photo counts are a fair guide.',
  'Moving to a smaller plan never deletes your work. Anything over a limit stays; you can add more once you’re back under it.',
  'If your team is bigger than a smaller plan’s seats, its members are removed and can be invited again up to the new limit.',
]

function Value({ cell }: { cell: Cell }) {
  if (cell === true) return <Icon name="check" className="yes" />
  if (cell === false) return <span className="no" aria-label="Not included">–</span>
  if (typeof cell === 'object') {
    return (
      <>
        {cell.text}
        <span className="note">{cell.note}</span>
      </>
    )
  }
  return <>{cell}</>
}

export function Pricing() {
  return (
    <div className="prod">
      <section className="prod-hero prod-pricing">
        <div className="wrap">
          <h1>Priced per production.</h1>
          <p className="lede">That’s how the budget works: the production pays, not the people on it.</p>

          <ul className="prod-plans">
            {plans.map((plan) => (
              <li key={plan.name}>
                <h2>{plan.name}</h2>
                <p className="who">{plan.who}</p>
                <p className="price">{plan.price}</p>
                <p className="per">{plan.per}</p>
                <p className="seats">{plan.seats}</p>
              </li>
            ))}
          </ul>

          <div className="prod-compare">
            <table>
              <thead>
                <tr>
                  <td />
                  {plans.map((plan) => (
                    <th key={plan.name} scope="col">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {table.map((section) => (
                <tbody key={section.group}>
                  <tr className="group">
                    <th scope="colgroup" colSpan={5}>
                      {section.group}
                    </th>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">
                        {row.label}
                        {row.soon && <span className="soon">Coming soon</span>}
                      </th>
                      {row.cells.map((cell, i) => (
                        <td key={i}>
                          <Value cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          <ul className="prod-notes">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="acts">
            <a className="pill dark" href="/contact/">
              Get in touch
            </a>
          </div>
          <p className="prod-note">To use StageRoll on a production before launch, write to us.</p>
        </div>
      </section>
    </div>
  )
}
