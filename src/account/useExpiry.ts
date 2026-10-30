import { useEffect, useEffectEvent } from 'react'

import { markActive, type Ended } from './expiry'
import { keptToken } from './keys'
import { endIfDue } from './signIn'

/**
 * An account page's side of the browser's rule (`expiry.ts`): a press, a
 * key or a scroll is someone using it, and the rule is asked again every
 * half minute and whenever the tab comes back, so a page left open on a
 * shared computer signs itself out where it stands. The page's own first
 * read asks first (`endIfDue`), before it uses the session; this keeps
 * asking while it is open. `onEnded` is the page's way out.
 */
export function useExpiry(onEnded: (why: Ended) => void): void {
  const end = useEffectEvent(onEnded)

  useEffect(() => {
    let ending = false
    const check = async (): Promise<boolean> => {
      if (ending) return false
      const why = await endIfDue()
      if (!why) return true
      ending = true
      end(why)
      return false
    }
    let usedAt = 0
    const used = () => {
      const now = Date.now()
      if (now - usedAt < 5_000 || !keptToken()) return
      usedAt = now
      void check().then((standing) => {
        if (standing) markActive()
      })
    }
    const back = () => {
      if (document.visibilityState === 'visible') void check()
    }

    const every = window.setInterval(() => void check(), 30_000)
    const touches = ['pointerdown', 'keydown', 'scroll'] as const
    touches.forEach((name) => window.addEventListener(name, used, { passive: true }))
    document.addEventListener('visibilitychange', back)
    return () => {
      window.clearInterval(every)
      touches.forEach((name) => window.removeEventListener(name, used))
      document.removeEventListener('visibilitychange', back)
    }
  }, [])
}
