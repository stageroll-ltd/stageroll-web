// Refuses an install on a Node older than package.json's `engines.node`.
// Yarn 4 does not check `engines` itself, and the floor is a security one:
// Node before 26.12.1 carries the Brotli decoder flaw (CVE-2026-111497).
import { readFileSync } from 'node:fs'

const { engines } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const least = engines.node.replace(/^>=/, '')
const parts = version => version.split('.').map(Number)
const [have, need] = [parts(process.versions.node), parts(least)]
const behind = need.findIndex((n, i) => have[i] !== n)

if (behind !== -1 && have[behind] < need[behind]) {
  console.error(
    `Node ${process.versions.node} is older than ${least}, the least this project runs on. Install a newer one (fnm install 26).`
  )
  process.exit(1)
}
