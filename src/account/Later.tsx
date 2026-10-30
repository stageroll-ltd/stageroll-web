import { useEffect, useState, type ComponentType } from 'react'

import { configured } from './keys'
import { Wait } from './Wait'

/**
 * An account page: prerendered as a quiet shell, drawn in the browser once
 * its code has loaded. Supabase and the page come in their own chunk, so
 * the rest of the site never loads them. `load` is the page's dynamic
 * import, made once at module level.
 */
export function Later({ load }: { load: () => Promise<{ default: ComponentType }> }) {
  const [Page, setPage] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!configured) {
      setFailed(true)
      return
    }
    let live = true
    load().then(
      (page) => live && setPage(() => page.default),
      (error: unknown) => {
        console.error('[account] the page did not load', error)
        if (live) setFailed(true)
      },
    )
    return () => {
      live = false
    }
  }, [load])

  if (Page) return <Page />
  if (failed) {
    return (
      <section className="acct">
        <div className="acct-col">
          <h1>Not available right now</h1>
          <p className="acct-sub">Signing in isn’t working at the moment. Try again in a little while.</p>
        </div>
      </section>
    )
  }
  return (
    <Wait>
      <noscript>
        <p className="acct-sub">Turn on JavaScript to sign in.</p>
      </noscript>
    </Wait>
  )
}
