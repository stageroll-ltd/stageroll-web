import type { ReactNode } from 'react'

import { Icon } from './Icon'

// The pieces every page but the home page opens and closes with, in the home
// page's look (home.css, then `.fr` in product.css): the opening in two
// voices, and the close with the ways on.

/**
 * A page's opening: a small line above, the headline in ink and the sentence
 * that runs on from it in the second colour, then anything under them.
 */
export function PageHero({
  kicker,
  heading,
  text,
  children,
}: {
  kicker?: ReactNode
  heading: string
  text: string
  children?: ReactNode
}) {
  return (
    <section className="hm-hero fr-hero">
      <div className="hm-col hm-hero-in">
        {kicker && <p className="hm-kicker">{kicker}</p>}
        <div className="hm-two hm-lead">
          <h1>{heading}</h1> <p>{text}</p>
        </div>
        {children && <div className="hm-acts">{children}</div>}
      </div>
    </section>
  )
}

/** A page's close: pricing (hidden when the app opens the site) and a way to write to us. */
export function PageClose({ id }: { id: string }) {
  return (
    <section className="hm-close fr-close" aria-labelledby={id}>
      <div className="hm-col">
        <h2 id={id}>Ready for your next production.</h2>
        <p>Plans are per production, and every crew account is free.</p>
        <div className="hm-acts">
          <a className="hm-btn dark sells" href="/pricing/">
            See pricing
          </a>
          <a className="hm-btn" href="/contact/">
            Get in touch <Icon name="chevron" />
          </a>
        </div>
      </div>
    </section>
  )
}
