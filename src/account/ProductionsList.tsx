import { useCallback, useEffect, useState } from 'react'

import { supabase } from './client'
import { isHeld } from './keys'
import { planLabel, readProductions, roleLabel, type ListRead, type Production } from './productions'
import { endIfDue, signOut } from './signIn'
import { useExpiry } from './useExpiry'
import { Wait } from './Wait'

// /productions/, drawn in the browser: the signed-in account's productions in
// two groups, its own (with the plan at the row's end, each opening its plan
// page, `PlanPage.tsx`) and the ones shared with it (with its role). Signed out, or held at the password, the page
// sends the person to /sign-in/, which knows which step they are on. A
// session past the browser's rule (`expiry.ts`) is signed out first, and
// sign-in says why.

const toSignIn = () => window.location.replace('/sign-in/')

/** A production with no name at all; a name is otherwise shown exactly as stored. */
const nameOf = (production: Production) => (production.name.trim() ? production.name : 'Untitled production')

export default function ProductionsList() {
  const [read, setRead] = useState<ListRead | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)

  const load = useCallback(async () => {
    if (await endIfDue()) return toSignIn()
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (!session || isHeld(session.access_token)) return toSignIn()
    setEmail(session.user.email ?? null)
    setRead(await readProductions(session.user.id))
  }, [])

  useEffect(() => {
    void load()
    // A session that ends while the page is open (signed out from another
    // device, a password reset there) takes the page back to sign-in.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') toSignIn()
    })
    return () => data.subscription.unsubscribe()
  }, [load])

  useExpiry(toSignIn)

  const leave = async () => {
    if (leaving) return
    setLeaving(true)
    await signOut()
    toSignIn()
  }

  if (!read) return <Wait />

  const signOutLink = (
    <p className="acct-foot">
      <button type="button" className="acct-link" onClick={() => void leave()} disabled={leaving}>
        Sign out
      </button>
    </p>
  )

  return (
    <section className="acct acct-wide">
      <div className="acct-col">
        <h1>Your productions</h1>
        {email && <p className="acct-sub">Signed in as {email}</p>}

        {read.kind !== 'read' ? (
          <div className="acct-empty">
            <p>
              {read.kind === 'offline'
                ? 'No connection. Check your network and try again.'
                : 'Your productions couldn’t be loaded.'}
            </p>
            <button
              type="button"
              className="pill acct-retry"
              onClick={() => {
                setRead(null)
                void load()
              }}
            >
              Try again
            </button>
          </div>
        ) : read.yours.length === 0 && read.shared.length === 0 ? (
          <div className="acct-empty">
            <h2>No productions yet</h2>
            <p>Productions you make or join in the StageRoll app show up here.</p>
          </div>
        ) : (
          <>
            <Group title="Yours" rows={read.yours} end={(p) => planLabel(p.tier)} href={planHref} />
            <Group title="Shared with you" rows={read.shared} end={(p) => roleLabel(p.role)} />
          </>
        )}

        {signOutLink}
      </div>
    </section>
  )
}

/** Your own production's plan page, where its plan and billing are changed. */
const planHref = (production: Production) => `/productions/plan/?id=${encodeURIComponent(production.id)}`

function Group({
  title,
  rows,
  end,
  href,
}: {
  title: string
  rows: Production[]
  end: (p: Production) => string
  /** Rows that open a page of their own. */
  href?: (p: Production) => string
}) {
  if (rows.length === 0) return null
  return (
    <section className="acct-group">
      <h2>{title}</h2>
      <ul className="acct-rows">
        {rows.map((production) => (
          <li key={production.id}>
            {href ? (
              <a className="acct-row-link" href={href(production)}>
                <span className="acct-name">{nameOf(production)}</span>
                <span className="acct-end">
                  {end(production)}
                  <span className="acct-chevron" aria-hidden="true" />
                </span>
              </a>
            ) : (
              <>
                <span className="acct-name">{nameOf(production)}</span>
                <span className="acct-end">{end(production)}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
