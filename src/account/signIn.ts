import {
  FunctionsFetchError,
  FunctionsHttpError,
  isAuthRetryableFetchError,
  type AuthError,
} from '@supabase/supabase-js'

import { supabase } from './client'
import { endedBy, noteEnded, type Ended } from './expiry'
import { claimsOf, isHeld, keptRefreshToken, keptToken, SESSION_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from './keys'
import type { CaptchaAnswer } from './Turnstile'

// Sign-in on the website, the app's own gate step for step. stageroll-native
// is the reference: `src/auth/auth.ts` (the code), `social.ts`, `door.web.ts`
// and `redirect.ts` (Google and Apple in a browser), `password.ts` (the
// password, whose server half is the `password` Edge Function). A code alone,
// or a Google or Apple sign-in in a browser, gives a HELD session that
// reaches nothing; only the password function lets it through. The pages see
// outcomes, never Supabase's errors.

/** Eight digits, alive ten minutes (the app's `src/auth/code.ts`). */
export const CODE_LENGTH = 8

/** The shortest password the server takes (`_shared/password.ts` › `PASSWORD_MIN`). */
export const PASSWORD_MIN = 10

/** The longest address a mail server takes (the app's `EMAIL_MAX`). */
export const EMAIL_MAX = 254

export const CONTACT = 'hello@stageroll.co'

const looksLikeAddress = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const looksLikeCode = (value: string) => new RegExp(`^\\d{${CODE_LENGTH}}$`).test(value)

/** auth-js calls a dead network and a 5xx "retryable"; only the first has no status. */
const offline = (error: AuthError) => isAuthRetryableFetchError(error) && !error.status

const refusedSignUp = (error: AuthError) => /\bsignup_refused\b/.test(error.message)

// ── Where this browser stands ───────────────────────────────────────────

export type Standing = 'out' | 'held' | 'passed'

export async function standing(): Promise<Standing> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return 'out'
  return isHeld(data.session.access_token) ? 'held' : 'passed'
}

/** The signed-in account's address, for the password step's "For …". */
export async function accountEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.email ?? null
}

/**
 * Sign out of this browser. The kept session goes first, so the page is
 * signed out whatever the network does; the server is told after, as the
 * app's `leave` does, so the session ends there too. `why` is the browser's
 * rule ending it (`expiry.ts`), for the sign-in page to say.
 */
export async function signOut(why: Ended | null = null): Promise<void> {
  const token = keptToken()
  const refresh = keptRefreshToken()
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* nothing kept to clear */
  }
  noteEnded(why)
  const live = token && !expired(token) ? token : refresh ? await renewed(refresh) : null
  if (live) {
    await supabase.auth.admin.signOut(live, 'local').catch(() => undefined)
  }
}

/** Expired, or about to be by the time the server reads it. */
function expired(token: string): boolean {
  const exp = claimsOf(token)?.exp
  return typeof exp !== 'number' || exp * 1000 < Date.now() + 30_000
}

/**
 * A token the server will take to end a session whose own has expired
 * (fifteen minutes, so always, once the idle rule ends one), from its
 * refresh token. Asked of Auth directly rather than through the client,
 * which would write the session back into this browser. Without signal,
 * none: the browser has forgotten the session all the same.
 */
async function renewed(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return null
    const body = (await response.json()) as { access_token?: unknown }
    return typeof body.access_token === 'string' ? body.access_token : null
  } catch {
    return null
  }
}

/**
 * The browser's rule (`expiry.ts`), asked of the session it keeps before
 * anything uses it: ended, it is signed out here and on the server, and
 * the answer says why. Null while it stands, or with no session at all.
 */
export async function endIfDue(): Promise<Ended | null> {
  const token = keptToken()
  const why = token ? endedBy(claimsOf(token)) : null
  if (why) await signOut(why)
  return why
}

// ── Email: the code ─────────────────────────────────────────────────────

export type RequestOutcome =
  | { kind: 'sent'; address: string }
  | { kind: 'invalid-address' }
  | { kind: 'rate-limited' }
  | { kind: 'blocked' }
  | { kind: 'refused' }
  | { kind: 'captcha' }
  | { kind: 'cancelled' }
  | { kind: 'offline' }
  | { kind: 'failed' }

/**
 * Mail a code. Every request carries a Turnstile token (Auth refuses one
 * without while the captcha is on). A widget that fails still sends, without
 * one, so Auth says why; only a box the person closed sends nothing.
 */
export async function requestCode(email: string, captcha: () => Promise<CaptchaAnswer>): Promise<RequestOutcome> {
  const address = email.trim().toLowerCase()
  if (!looksLikeAddress(address)) return { kind: 'invalid-address' }
  const answer = await captcha()
  if (answer.kind === 'cancelled') return { kind: 'cancelled' }
  const { error } = await supabase.auth.signInWithOtp({
    email: address,
    options: { shouldCreateUser: true, captchaToken: answer.kind === 'token' ? answer.token : undefined },
  })
  if (!error) return { kind: 'sent', address }
  if (offline(error)) return { kind: 'offline' }
  if (error.status === 429) return { kind: 'rate-limited' }
  if (error.code === 'user_banned') return { kind: 'blocked' }
  if (refusedSignUp(error)) return { kind: 'refused' }
  if (error.code === 'captcha_failed') return { kind: 'captcha' }
  console.error('[sign-in] the code request failed', error)
  return { kind: 'failed' }
}

export type VerifyOutcome =
  | { kind: 'held' }
  | { kind: 'passed' }
  | { kind: 'wrong-code' }
  | { kind: 'rate-limited' }
  | { kind: 'blocked' }
  | { kind: 'offline' }
  | { kind: 'failed' }

export async function verifyCode(address: string, code: string): Promise<VerifyOutcome> {
  if (!looksLikeCode(code)) return { kind: 'wrong-code' }
  const { data, error } = await supabase.auth.verifyOtp({ email: address, token: code, type: 'email' })
  if (error) {
    if (offline(error)) return { kind: 'offline' }
    if (error.status === 429) return { kind: 'rate-limited' }
    // Supabase answers a wrong code and an expired one alike.
    if (error.code === 'otp_expired') return { kind: 'wrong-code' }
    if (error.code === 'user_banned') return { kind: 'blocked' }
    console.error('[sign-in] the code check failed', error)
    return { kind: 'failed' }
  }
  if (!data.session) {
    console.error('[sign-in] the code was taken without a session')
    return { kind: 'failed' }
  }
  return { kind: isHeld(data.session.access_token) ? 'held' : 'passed' }
}

// ── Google and Apple: the browser doors ─────────────────────────────────

export type Provider = 'google' | 'apple'

export type DoorOutcome =
  /** The page is on its way to the provider, and comes back to /sign-in/. */
  | { kind: 'left' }
  /** Auth has no working door for this provider yet. */
  | { kind: 'unavailable' }
  | { kind: 'offline' }
  | { kind: 'failed' }

/**
 * The page itself goes to the provider and comes back to /sign-in/ with the
 * session in its address (`land`), as the app's web build does
 * (`door.web.ts`). The address is asked for first and knocked on before the
 * page leaves: a provider Auth has not set up answers a bare JSON error,
 * which is no page to send anybody to.
 */
export async function openDoor(provider: Provider): Promise<DoorOutcome> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/sign-in/`,
      skipBrowserRedirect: true,
      // Someone with two Google accounts picks one, rather than getting whichever was used last.
      queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
    },
  })
  if (error || !data.url) {
    console.error(`[sign-in] no ${provider} address`, error)
    return { kind: 'failed' }
  }
  let knock: Response
  try {
    knock = await fetch(data.url, { redirect: 'manual' })
  } catch {
    return { kind: 'offline' }
  }
  // A working door is Auth's redirect to the provider, which a manual fetch
  // sees only as "it redirected". Anything else is Auth refusing the door.
  if (knock.type !== 'opaqueredirect') {
    const said = await knock.text().catch(() => '')
    console.warn(`[sign-in] Auth has no ${provider} door`, knock.status, said)
    return { kind: knock.status === 400 ? 'unavailable' : 'failed' }
  }
  window.location.assign(data.url)
  return { kind: 'left' }
}

type Landing =
  | { kind: 'tokens'; accessToken: string; refreshToken: string }
  | { kind: 'error'; code: string; description: string }

/** The query and the fragment together: Auth puts tokens in the fragment and errors in either. */
function landingOf(url: URL): Landing | null {
  const params = new URLSearchParams(url.search)
  new URLSearchParams(url.hash.slice(1)).forEach((value, key) => params.set(key, value))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  if (accessToken && refreshToken) return { kind: 'tokens', accessToken, refreshToken }
  const error = params.get('error')
  if (error) {
    return { kind: 'error', code: params.get('error_code') ?? error, description: params.get('error_description') ?? '' }
  }
  return null
}

/**
 * What the page came back from a door with. The address goes back to the
 * bare path straight away, so a reload, the history and a screenshot never
 * hold the tokens.
 */
function takeLanding(): Landing | null {
  const landed = landingOf(new URL(window.location.href))
  if (landed) window.history.replaceState(null, '', window.location.pathname)
  return landed
}

export type LandOutcome =
  | { kind: 'held' }
  | { kind: 'passed' }
  | { kind: 'refused' }
  | { kind: 'blocked' }
  | { kind: 'cancelled' }
  | { kind: 'offline' }
  | { kind: 'failed' }

let landed: Promise<LandOutcome | null> | null = null

/**
 * The page back from a door: its session, or why there is none. Null on an
 * ordinary visit. Asked once per page, however often the page asks.
 */
export function land(): Promise<LandOutcome | null> {
  landed ??= landOnce()
  return landed
}

async function landOnce(): Promise<LandOutcome | null> {
  const landing = takeLanding()
  if (!landing) return null
  if (landing.kind === 'error') {
    // Auth puts the sign-up hook's word in the description; a person who
    // said no at the provider is `access_denied` with nothing more.
    if (landing.description.includes('signup_refused')) return { kind: 'refused' }
    if (landing.code === 'user_banned' || /banned/i.test(landing.description)) return { kind: 'blocked' }
    if (landing.code === 'access_denied' && !landing.description) return { kind: 'cancelled' }
    console.error('[sign-in] a door came back refused', landing)
    return { kind: 'failed' }
  }
  const { data, error } = await supabase.auth.setSession({
    access_token: landing.accessToken,
    refresh_token: landing.refreshToken,
  })
  if (error || !data.session) {
    if (error && offline(error)) return { kind: 'offline' }
    if (error?.code === 'user_banned') return { kind: 'blocked' }
    if (error && refusedSignUp(error)) return { kind: 'refused' }
    console.error('[sign-in] the door’s session was refused', error)
    return { kind: 'failed' }
  }
  return { kind: isHeld(data.session.access_token) ? 'held' : 'passed' }
}

// ── The password ────────────────────────────────────────────────────────

export interface PasswordState {
  hasPassword: boolean
  /** Ten wrong in a row: nothing passes until a reset or a change. */
  locked: boolean
  passed: boolean
  /** When a reset under way can be finished, or null when none is. */
  resetReadyAt: string | null
  /** The account signs in with Apple: with no password it is never offered one here. */
  apple: boolean
}

type Lost =
  | { kind: 'offline' }
  | { kind: 'failed' }
  /** The session is gone (signed out from another device, or a reset there): this browser is signed out too. */
  | { kind: 'ended' }

export type StateRead = { kind: 'read'; state: PasswordState } | Lost
export type CheckOutcome = { kind: 'passed' } | { kind: 'wrong' } | { kind: 'locked' } | { kind: 'none' } | Lost
export type ChooseOutcome =
  | { kind: 'passed' }
  | { kind: 'short' }
  | { kind: 'long' }
  | { kind: 'leaked' }
  | { kind: 'exists' }
  | { kind: 'apple' }
  | { kind: 'stale' }
  | { kind: 'not-ready' }
  | Lost
export type ResetAsk = { kind: 'requested'; readyAt: string } | { kind: 'none' } | Lost
export type CancelOutcome = { kind: 'cancelled' } | { kind: 'none' } | Lost

type Answer = { outcome?: string; state?: PasswordState; readyAt?: string }

const lost = (answer: Answer | Lost): answer is Lost => 'kind' in answer

async function ask(action: string, extra: Record<string, string> = {}, again = false): Promise<Answer | Lost> {
  const { data, error } = await supabase.functions.invoke<Answer>('password', {
    method: 'POST',
    body: { action, ...extra },
  })
  if (!error) return data ?? {}
  if (error instanceof FunctionsFetchError) return { kind: 'offline' }
  const status = error instanceof FunctionsHttpError ? (error.context as Response).status : null
  if (status === 401) {
    // The function no longer knows this session. A refresh asks Auth: a
    // session that has ended is refused, and the browser signs out; a token
    // that had only gone stale comes back, and the step is asked once more.
    if (!again) {
      const { error: refused } = await supabase.auth.refreshSession()
      if (!refused) return ask(action, extra, true)
      if (isAuthRetryableFetchError(refused)) return { kind: 'offline' }
    }
    await signOut()
    return { kind: 'ended' }
  }
  console.error(`[password] ${action} failed${status ? ` (${status})` : ''}`, error)
  return { kind: 'failed' }
}

/** The session has passed: take the token that says so before anything else is asked. */
async function through(): Promise<{ kind: 'passed' } | Lost> {
  const { error } = await supabase.auth.refreshSession()
  if (error) {
    console.error('[password] the refresh after passing failed', error)
    return { kind: 'failed' }
  }
  return { kind: 'passed' }
}

function unexpected(action: string, answer: Answer): { kind: 'failed' } {
  console.error(`[password] ${action} answered without an outcome`, answer)
  return { kind: 'failed' }
}

export async function readState(): Promise<StateRead> {
  const answer = await ask('state')
  if (lost(answer)) return answer
  if (!answer.state) return unexpected('state', answer)
  return { kind: 'read', state: answer.state }
}

export async function checkPassword(password: string): Promise<CheckOutcome> {
  const answer = await ask('check', { password })
  if (lost(answer)) return answer
  switch (answer.outcome) {
    case 'passed':
      return through()
    case 'wrong':
    case 'locked':
    case 'none':
      return { kind: answer.outcome }
    default:
      return unexpected('check', answer)
  }
}

/** `new`, the first password; `reset`, a reset that is ready. Both pass the session. */
export async function choosePassword(kind: 'new' | 'reset', password: string): Promise<ChooseOutcome> {
  const answer = await ask(kind, { password })
  if (lost(answer)) return answer
  switch (answer.outcome) {
    case 'passed':
      return through()
    case 'short':
    case 'long':
    case 'leaked':
    case 'exists':
    case 'apple':
    case 'stale':
    case 'not-ready':
      return { kind: answer.outcome }
    default:
      return unexpected(kind, answer)
  }
}

export async function requestReset(): Promise<ResetAsk> {
  const answer = await ask('request-reset')
  if (lost(answer)) return answer
  if (answer.outcome === 'requested' && answer.readyAt) return { kind: 'requested', readyAt: answer.readyAt }
  if (answer.outcome === 'none') return { kind: 'none' }
  return unexpected('request-reset', answer)
}

export async function cancelReset(): Promise<CancelOutcome> {
  const answer = await ask('cancel-reset')
  if (lost(answer)) return answer
  if (answer.outcome === 'cancelled' || answer.outcome === 'none') return { kind: answer.outcome }
  return unexpected('cancel-reset', answer)
}

/** Whether a reset's time has come. */
export const resetIsReady = (readyAt: string, now = Date.now()) => Date.parse(readyAt) <= now

/** "Saturday 24 October at 14:20", in the browser's own words and time. */
export function readyLabel(iso: string): string {
  const at = new Date(iso)
  const day = at.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  const time = at.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${day.replace(',', '')} at ${time}`
}
