import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

// Cloudflare Turnstile in front of every code request, as in the app
// (stageroll-native `src/auth/captcha.ts`, `CaptchaWidget.web.tsx`). Managed
// and seen only when Cloudflare asks: the widget runs out of sight and
// hands back a token, and only a visitor it is unsure of is shown its box.
// A fresh widget per request, since a token is good for one request only.
// With no site key nothing is asked for and the request goes without one.

export type CaptchaAnswer =
  | { kind: 'off' }
  | { kind: 'token'; token: string }
  /** The person closed the box: send nothing. */
  | { kind: 'cancelled' }
  /** The widget could not run: send without one, and Auth says why. */
  | { kind: 'failed' }

type Signal =
  | { kind: 'token'; token: string }
  | { kind: 'error' }
  | { kind: 'interactive' }
  | { kind: 'settled' }

interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string | undefined
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    stagerollTurnstileReady?: () => void
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Long enough to tick a box; past it the request goes without a token. */
const WAIT_MS = 120_000

let loading: Promise<TurnstileApi> | null = null

/** Cloudflare's script, loaded the first time a token is asked for. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    window.stagerollTurnstileReady = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('load')))
    const script = document.createElement('script')
    script.src = `${SCRIPT}&onload=stagerollTurnstileReady`
    script.async = true
    script.onerror = () => {
      // A later ask tries the script again.
      loading = null
      script.remove()
      reject(new Error('load'))
    }
    document.head.appendChild(script)
  })
  return loading
}

function Widget({ siteKey, onSignal }: { siteKey: string; onSignal: (signal: Signal) => void }) {
  const box = useRef<HTMLDivElement>(null)
  // The latest handler, so a re-render never re-runs the challenge.
  const said = useRef(onSignal)
  useEffect(() => {
    said.current = onSignal
  }, [onSignal])

  useEffect(() => {
    let live = true
    let id: string | undefined
    const say = (signal: Signal) => {
      if (live) said.current(signal)
    }
    loadTurnstile()
      .then((turnstile) => {
        if (!live || !box.current) return
        id = turnstile.render(box.current, {
          sitekey: siteKey,
          theme: 'light',
          // Cloudflare's normal box (300 wide) where the column has room for
          // it on its paper, its compact one on a narrow phone.
          size: window.innerWidth >= 372 ? 'normal' : 'compact',
          appearance: 'interaction-only',
          callback: (token: string) => say({ kind: 'token', token }),
          'error-callback': () => {
            say({ kind: 'error' })
            return true
          },
          'unsupported-callback': () => say({ kind: 'error' }),
          'before-interactive-callback': () => say({ kind: 'interactive' }),
          'after-interactive-callback': () => say({ kind: 'settled' }),
        })
      })
      .catch(() => say({ kind: 'error' }))
    return () => {
      live = false
      if (id) window.turnstile?.remove(id)
    }
  }, [siteKey])

  return <div ref={box} className="acct-captcha-widget" />
}

type Ask = { id: number; settle: (answer: CaptchaAnswer) => void }

/**
 * `token()` for a request that mails a code, and `box`, where the widget
 * runs: out of sight until Cloudflare wants the visitor, then in the form
 * with a line and a way out.
 */
export function useCaptcha(siteKey: string | null): { token: () => Promise<CaptchaAnswer>; box: ReactNode } {
  const [ask, setAsk] = useState<Ask | null>(null)
  const [shown, setShown] = useState(false)
  const asked = useRef(0)

  const token = useCallback((): Promise<CaptchaAnswer> => {
    if (!siteKey) return Promise.resolve({ kind: 'off' })
    return new Promise((resolve) => {
      asked.current += 1
      let done = false
      const settle = (answer: CaptchaAnswer) => {
        if (done) return
        done = true
        clearTimeout(timer)
        setAsk(null)
        setShown(false)
        resolve(answer)
      }
      const timer = setTimeout(() => settle({ kind: 'failed' }), WAIT_MS)
      setAsk({ id: asked.current, settle })
    })
  }, [siteKey])

  const heard = useCallback(
    (signal: Signal) => {
      switch (signal.kind) {
        case 'token':
          ask?.settle({ kind: 'token', token: signal.token })
          return
        case 'error':
          ask?.settle({ kind: 'failed' })
          return
        case 'interactive':
          setShown(true)
          return
        case 'settled':
          setShown(false)
      }
    },
    [ask],
  )

  const box =
    ask && siteKey ? (
      // One tree whether shown or not, so showing the box never restarts the challenge.
      <div className={shown ? 'acct-captcha shown' : 'acct-captcha'} inert={!shown}>
        <p>Confirm you’re a person and your code is on its way.</p>
        <Widget key={ask.id} siteKey={siteKey} onSignal={heard} />
        <button type="button" className="acct-link" onClick={() => ask.settle({ kind: 'cancelled' })}>
          Cancel
        </button>
      </div>
    ) : null

  return { token, box }
}
