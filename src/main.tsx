import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { App } from './App'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('index.html has no #root')

// The markup is already in the HTML (entry-server.tsx); hydrate it.
hydrateRoot(
  root,
  <StrictMode>
    <App />
  </StrictMode>,
)
