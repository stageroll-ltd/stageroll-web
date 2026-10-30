import { createClient } from '@supabase/supabase-js'

import { configured, SESSION_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from './keys'

if (!configured) {
  throw new Error('The account pages need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (.env)')
}

/**
 * The account pages' one Supabase client. The session lives in this
 * browser's localStorage, as the app's web build keeps it. No session
 * detection in the address: a Google or Apple sign-in comes back to
 * /sign-in/ and the page reads it itself (`signIn.ts` › `landing`), so a
 * refusal there is said rather than swallowed.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: SESSION_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
