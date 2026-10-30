import type { ReactNode } from 'react'

/** The account pages before they know anything: a quiet mark where the page will be. */
export function Wait({ children }: { children?: ReactNode }) {
  return (
    <section className="acct" aria-busy="true">
      <div className="acct-col acct-waiting">
        <span className="acct-spin" aria-label="Loading" />
        {children}
      </div>
    </section>
  )
}
