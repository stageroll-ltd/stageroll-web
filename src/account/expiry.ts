// When a browser's sign-in ends by itself. The site is often opened on a
// shared computer in a production office, so a session it keeps ends after
// IDLE without anyone using the account pages, and after MOST however much
// it is used. The phone keeps its own sessions: Auth's own session limits
// are the whole project's and would sign the phones out too, so the rule
// is the browser's, checked before any page uses the session, and a
// session it ends is ended on the server as well (`signIn.ts` › `signOut`).
//
// No Supabase here: the header reads this on every page (`keys.ts`).

export const IDLE_MINUTES = 30
export const MOST_HOURS = 12

const IDLE_MS = IDLE_MINUTES * 60_000
const MOST_MS = MOST_HOURS * 3_600_000

/** When the account pages were last used in this browser, shared by its tabs. */
const ACTIVE_KEY = 'stageroll-account-active'
/** Why the last session ended, for the sign-in page to say once. */
const ENDED_KEY = 'stageroll-account-ended'

export type Ended = 'idle' | 'long'

/**
 * When the session was signed in to, from the token's own record of it:
 * Auth stamps each way in (`amr`: the code, Google, Apple) and keeps the
 * stamps through every refresh, and passing the password refreshes
 * without signing in again, so this is the code's or the door's moment.
 */
function signedInAt(claims: Record<string, unknown>): number | null {
  const amr = claims.amr
  if (!Array.isArray(amr)) return null
  const stamps = amr
    .map((entry) => (entry as { timestamp?: unknown } | null)?.timestamp)
    .filter((stamp): stamp is number => typeof stamp === 'number')
  return stamps.length ? Math.max(...stamps) * 1000 : null
}

function lastActive(): number | null {
  try {
    const kept = Number(localStorage.getItem(ACTIVE_KEY))
    return Number.isFinite(kept) && kept > 0 ? kept : null
  } catch {
    return null
  }
}

/**
 * Whether a session has ended by the rule, and which part of it. A
 * session with no stamp of its own is held to the activity alone; a
 * stamp left by an earlier session never makes a new one idle, since the
 * sign-in counts as activity.
 */
export function endedBy(claims: Record<string, unknown> | null, now = Date.now()): Ended | null {
  if (!claims) return null
  const at = signedInAt(claims)
  if (at !== null && now - at > MOST_MS) return 'long'
  const last = Math.max(lastActive() ?? 0, at ?? 0)
  if (last > 0 && now - last > IDLE_MS) return 'idle'
  return null
}

let written = 0

/** Someone is using the account pages. Written at most every few seconds. */
export function markActive(now = Date.now()): void {
  if (now - written < 5_000) return
  written = now
  try {
    localStorage.setItem(ACTIVE_KEY, String(now))
  } catch {
    /* storage refused: the sign-in's own stamp still counts */
  }
}

/** Remember why, for the sign-in page; the activity goes with the session. */
export function noteEnded(why: Ended | null): void {
  try {
    localStorage.removeItem(ACTIVE_KEY)
    if (why) sessionStorage.setItem(ENDED_KEY, why)
  } catch {
    /* nothing to say then */
  }
}

/** Why the last session ended, once. */
export function takeEnded(): Ended | null {
  try {
    const why = sessionStorage.getItem(ENDED_KEY)
    sessionStorage.removeItem(ENDED_KEY)
    return why === 'idle' || why === 'long' ? why : null
  } catch {
    return null
  }
}

export const ENDED_NOTICE: Record<Ended, string> = {
  idle: `You were signed out after ${IDLE_MINUTES} minutes without activity.`,
  long: `You were signed out after ${MOST_HOURS} hours. Sign in again to carry on.`,
}
