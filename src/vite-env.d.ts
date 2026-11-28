/// <reference types="vite/client" />

// The account pages' public keys (.env).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  // PostHog's public project token: page visits and errors (src/analytics.ts).
  readonly VITE_POSTHOG_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
