import type { Route } from '../routes'

/**
 * `pages.ts` for a build without the account pages (vite.config.ts aliases
 * this in when VITE_ACCOUNT_PAGES is not 'on'): the same exports, with no
 * pages, no header link and nobody signed in, and no import of anything
 * under account/, so none of it is built.
 */
export const accountPages = false

export const accountRoutes = (): Route[] => []

export const signedIn = (): boolean => false
