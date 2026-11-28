// The build that never fetches a script from PostHog's servers, plus the one
// piece it would have fetched: the error capture. The site's
// Content-Security-Policy lets scripts run only from stageroll.co
// (`vite.config.ts`), so a fetched piece would be refused.
import posthog from 'posthog-js/dist/module.no-external'
import 'posthog-js/dist/exception-autocapture'

/**
 * PostHog on the website (28 November 2026): which pages are visited, and
 * the JavaScript errors visitors' browsers hit. GitHub Pages keeps no logs
 * we can read, so this is the only record of either. Same project and EU
 * cloud (Frankfurt) as the app, which holds the reasons
 * (`stageroll-native/src/analytics/client.ts`); every event here says
 * `source: website`.
 *
 * COOKIELESS: nothing is kept in the visitor's browser (no cookie, no
 * local or session storage), so there is no banner to show. PostHog counts
 * visitors with a hash it makes on its own servers, which changes daily:
 * a visitor who comes back another day counts again. The project's
 * cookieless setting must stay on, or PostHog drops these events.
 *
 * NOT RECORDED: clicks (autocapture reads the element's text, and the
 * account pages show a person's name and plan), session recordings,
 * surveys. Only on stageroll.co itself: `yarn dev`, a preview and the
 * prerender send nothing.
 *
 * NO SCRIPT IS EVER OPENED ON THIS SITE, so an error here cannot carry one.
 * Its error reports do carry the error's own message, unlike the app's
 * (`stageroll-native/src/analytics/rules.ts`). If the site ever reads a
 * script, it takes the app's rule first.
 *
 * The token is the project's public one, made to ship in web pages, and is
 * the Actions variable VITE_POSTHOG_KEY like the site's other public values
 * (no env file is in git). Unset, nothing is sent.
 */
export const POSTHOG_HOST = 'https://eu.i.posthog.com'

export function startAnalytics(): void {
  const token = import.meta.env.VITE_POSTHOG_KEY
  if (!token || window.location.hostname !== 'stageroll.co') return
  posthog.init(token, {
    api_host: POSTHOG_HOST,
    cookieless_mode: 'always',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    capture_exceptions: true,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    person_profiles: 'identified_only',
    before_send: (event) => (event ? { ...event, properties: { ...event.properties, source: 'website' } } : null),
  })
}
