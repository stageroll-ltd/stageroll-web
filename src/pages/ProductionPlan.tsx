import { Later } from '../account/Later'

// Drawn in the browser (account/PlanPage.tsx); the build prerenders the shell.
const load = () => import('../account/PlanPage')

export function ProductionPlan() {
  return <Later load={load} />
}
