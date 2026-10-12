import { Layout } from './Layout'
import { findRoute } from './routes'

// One static page per route. The build renders each to its own HTML file
// (scripts/prerender.mjs); the browser hydrates whichever it was given.
export function App({ path }: { path: string }) {
  const route = findRoute(path)
  return (
    <Layout current={route.path} end={route.End && <route.End />}>
      <route.Page />
    </Layout>
  )
}
