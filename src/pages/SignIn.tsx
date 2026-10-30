import { Later } from '../account/Later'

// Drawn in the browser (account/SignInFlow.tsx); the build prerenders the shell.
const load = () => import('../account/SignInFlow')

export function SignIn() {
  return <Later load={load} />
}
