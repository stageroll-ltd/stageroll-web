import { ProductionPlan } from '../pages/ProductionPlan'
import { Productions } from '../pages/Productions'
import { SignIn } from '../pages/SignIn'
import type { Route } from '../routes'

export { signedIn } from './keys'

/**
 * The account pages, /sign-in/, /productions/ and the plan page, and the
 * header's way into them: everything of the account the rest of the site
 * reaches. A build has them only with VITE_ACCOUNT_PAGES=on, which
 * .env.development sets for `yarn dev` and nothing sets for the deploy:
 * vite.config.ts then serves `pages.off.ts` in this module's place, so none
 * of this is built, not the pages' chunks, not Supabase, not its keys, and
 * the live site answers these paths with the 404 page. When billing goes
 * live the line moves to .env and the deploy has them too. To build them
 * locally: `VITE_ACCOUNT_PAGES=on yarn build`.
 */
export const accountPages = true

/** Drawn in the browser behind a prerendered shell; the sitemap leaves them out. */
export function accountRoutes(): Route[] {
  return [
    {
      path: '/sign-in/',
      title: 'Sign in — StageRoll',
      description: 'Sign in to your StageRoll account.',
      Page: SignIn,
      noindex: true,
    },
    {
      path: '/productions/',
      title: 'Your productions — StageRoll',
      description: 'The productions on your StageRoll account.',
      Page: Productions,
      noindex: true,
    },
    {
      path: '/productions/plan/',
      title: 'Plan — StageRoll',
      description: 'A production’s plan and billing.',
      Page: ProductionPlan,
      noindex: true,
    },
  ]
}
