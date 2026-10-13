import { Icon } from '../components/Icon'
import type { FeaturePage } from './features'

// One feature page under /product/: what the area is, how it works and its
// key features, each with its icon, as a plain document (product.css,
// .prod-doc). The content is in features.ts.

function List({ items }: { items: [string, string][] }) {
  return items.map(([lead, text]) => (
    <li key={lead}>
      <strong>{lead}</strong> {text}
    </li>
  ))
}

export function Feature({ page }: { page: FeaturePage }) {
  return (
    <article className="prose prod-doc">
      <p className="updated">
        <a href="/product/">Product</a>
      </p>
      <h1>{page.title}</h1>
      <p className="lede">{page.lede}</p>

      <h2>How it works</h2>
      <ol>
        <List items={page.steps} />
      </ol>

      <h2>Key features</h2>
      <ul className="prod-doc-feats">
        {page.features.map(([lead, text, icon]) => (
          <li key={lead}>
            <Icon name={icon} />
            <strong>{lead}</strong> {text}
          </li>
        ))}
      </ul>

      {page.more && (
        <p>
          <a href={page.more.href}>{page.more.label}</a>
        </p>
      )}
      <p>
        <a href="/product/">See every StageRoll feature</a>
      </p>
    </article>
  )
}
