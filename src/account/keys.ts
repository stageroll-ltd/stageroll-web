// What every page may know about the account without loading Supabase: the
// project's public keys, where supabase-js keeps the session in this
// browser, and whether that session has passed the password. The header's
// link reads it on every page; the account pages load the client itself
// (client.ts) only when they open.

import { endedBy } from './expiry'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
/** Unset, no captcha is asked for, as in the app (`src/auth/captcha.ts`). */
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || null

export const configured = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''

/**
 * The key supabase-js keeps the session under, `sb-<project ref>-auth-token`,
 * computed the way it computes its own default (the app's `storageKey.ts`).
 */
export const SESSION_KEY = configured
  ? `sb-${new URL(SUPABASE_URL).hostname.split('.')[0]}-auth-token`
  : 'sb-auth-token'

/** A JWT's claims, unchecked: Auth checked the token when it issued it. */
export function claimsOf(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1]
  if (!part) return null
  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const claims: unknown = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
    return typeof claims === 'object' && claims !== null ? (claims as Record<string, unknown>) : null
  } catch {
    return null
  }
}

/**
 * A session that has entered its code (or come back from Google or Apple)
 * and not yet its password. Auth's access token hook stamps its token
 * `anon`, so it reaches nothing but the `password` function
 * (stageroll-native `20261023120000_account_passwords.sql`).
 */
export function isHeld(accessToken: string): boolean {
  return claimsOf(accessToken)?.role === 'anon'
}

/** The session this browser keeps, as supabase-js wrote it, or null. */
function kept(): { access_token?: unknown; refresh_token?: unknown } | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
    return typeof value === 'object' && value !== null ? value : null
  } catch {
    return null
  }
}

/** The access token this browser keeps, expired or not, or null. */
export function keptToken(): string | null {
  const token = kept()?.access_token
  return typeof token === 'string' ? token : null
}

/** The refresh token this browser keeps, or null: what can still end a session whose access token has expired. */
export function keptRefreshToken(): string | null {
  const token = kept()?.refresh_token
  return typeof token === 'string' ? token : null
}

/**
 * Whether this browser keeps a session that has passed the password and
 * has not ended by the browser's rule (`expiry.ts`): one past it is signed
 * out by the next account page, and the header already says Sign in.
 */
export function signedIn(): boolean {
  const token = keptToken()
  return token !== null && !isHeld(token) && endedBy(claimsOf(token)) === null
}
