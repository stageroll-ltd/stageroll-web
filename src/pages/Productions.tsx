import { Later } from '../account/Later'

// Drawn in the browser (account/ProductionsList.tsx); the build prerenders the shell.
const load = () => import('../account/ProductionsList')

export function Productions() {
  return <Later load={load} />
}
