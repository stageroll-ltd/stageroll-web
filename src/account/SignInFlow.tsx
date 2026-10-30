import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { ENDED_NOTICE, takeEnded, type Ended } from './expiry'
import { TURNSTILE_SITE_KEY } from './keys'
import {
  accountEmail,
  cancelReset,
  checkPassword,
  choosePassword,
  CODE_LENGTH,
  CONTACT,
  EMAIL_MAX,
  endIfDue,
  land,
  openDoor,
  PASSWORD_MIN,
  readState,
  readyLabel,
  requestCode,
  requestReset,
  resetIsReady,
  signOut,
  standing,
  verifyCode,
  type ChooseOutcome,
  type LandOutcome,
  type PasswordState,
  type Provider,
  type RequestOutcome,
} from './signIn'
import { useCaptcha } from './Turnstile'
import { useExpiry } from './useExpiry'
import { Wait } from './Wait'

// /sign-in/, drawn in the browser: email, then the emailed code, then the
// account's password, or Google or Apple and then the password. The app's
// own sign-in (stageroll-native `app/(auth)/login.tsx`, `verify.tsx`,
// `password.tsx`, `forgot.tsx`) without what follows it there: a session
// that passes goes to /productions/.

const OFFLINE = 'No connection. Check your network and try again.'
const FAILED = 'Something went wrong. Please try again.'
const ACCOUNT_BANNED = `This account is no longer accessible. Contact us at ${CONTACT}.`
const SIGNUP_REFUSED = `That email address can’t be used to sign up. Use another one, or contact us at ${CONTACT}.`
const SIGNED_OUT = 'You were signed out. Sign in again.'

const PROVIDER_NAME: Record<Provider, string> = { google: 'Google', apple: 'Apple' }

function requestNotice(outcome: Exclude<RequestOutcome, { kind: 'sent' | 'cancelled' }>): string {
  switch (outcome.kind) {
    case 'invalid-address':
      return 'Check the email address and try again.'
    case 'rate-limited':
      return 'Too many requests. Wait a few minutes.'
    case 'blocked':
      return ACCOUNT_BANNED
    case 'refused':
      return SIGNUP_REFUSED
    case 'captcha':
      return 'We couldn’t confirm you’re a person. Try again.'
    case 'offline':
      return OFFLINE
    case 'failed':
      return 'Something went wrong. Check your email and try again.'
  }
}

function landNotice(outcome: Exclude<LandOutcome, { kind: 'held' | 'passed' | 'cancelled' }>): string {
  switch (outcome.kind) {
    case 'refused':
      return SIGNUP_REFUSED
    case 'blocked':
      return ACCOUNT_BANNED
    case 'offline':
      return OFFLINE
    case 'failed':
      return FAILED
  }
}

/** Every refusal a chosen password can meet, in the app's words. */
function chooseNotice(kind: Exclude<ChooseOutcome['kind'], 'passed'>): string {
  switch (kind) {
    case 'short':
      return `Use at least ${PASSWORD_MIN} characters.`
    case 'long':
      return 'That password is too long.'
    case 'leaked':
      return 'That password has turned up in a data breach. Choose a different one.'
    case 'exists':
      return 'This account already has a password. Enter it instead.'
    case 'apple':
      return 'This account uses Sign in with Apple.'
    case 'stale':
      return 'Sign in again with a new code to finish the reset.'
    case 'not-ready':
      return 'The reset isn’t ready yet.'
    case 'offline':
      return OFFLINE
    case 'failed':
    case 'ended':
      return FAILED
  }
}

type Step =
  | { at: 'reading' }
  | { at: 'email'; address: string }
  | { at: 'code'; address: string }
  | { at: 'password' }
  | { at: 'forgot' }
  | { at: 'leaving' }

/** Passed: on to the account's productions, with the sign-in page out of the history. */
function onward() {
  window.location.replace('/productions/')
}

export default function SignInFlow() {
  const [step, setStep] = useState<Step>({ at: 'reading' })
  const [notice, setNotice] = useState<string | null>(null)

  const go = useCallback((next: Step, said: string | null = null) => {
    setStep(next)
    setNotice(said)
  }, [])

  const passed = useCallback(() => {
    go({ at: 'leaving' })
    onward()
  }, [go])

  /** Signed out from a step past the code: back to the start, saying why when there is a why. */
  const out = useCallback(
    async (said: string | null = null) => {
      await signOut()
      go({ at: 'email', address: '' }, said)
    },
    [go],
  )

  /* Ended by the browser's rule (`expiry.ts`), here or on the page that
     sent the person here: back to the start, saying why. */
  const ended = useCallback(
    (why: Ended) => {
      takeEnded()
      go({ at: 'email', address: '' }, ENDED_NOTICE[why])
    },
    [go],
  )
  useExpiry(ended)

  // The page back from Google or Apple carries its session in the address;
  // otherwise the session this browser keeps says which step this is, once
  // the browser's rule has had its say.
  useEffect(() => {
    let live = true
    void (async () => {
      const landed = await land()
      if (!live) return
      if (landed) {
        switch (landed.kind) {
          case 'held':
            return go({ at: 'password' })
          case 'passed':
            return passed()
          case 'cancelled':
            return go({ at: 'email', address: '' })
          default:
            return go({ at: 'email', address: '' }, landNotice(landed))
        }
      }
      const why = await endIfDue()
      if (!live) return
      if (why) return ended(why)
      const where = await standing()
      if (!live) return
      if (where === 'passed') return passed()
      if (where === 'held') return go({ at: 'password' })
      const before = takeEnded()
      go({ at: 'email', address: '' }, before ? ENDED_NOTICE[before] : null)
    })()
    return () => {
      live = false
    }
  }, [go, passed, ended])

  switch (step.at) {
    case 'reading':
    case 'leaving':
      return <Wait />
    case 'email':
      return (
        <EmailStep
          initial={step.address}
          notice={notice}
          say={setNotice}
          onSent={(address) => go({ at: 'code', address })}
        />
      )
    case 'code':
      return (
        <CodeStep
          address={step.address}
          notice={notice}
          say={setNotice}
          onHeld={() => go({ at: 'password' })}
          onPassed={passed}
          onBack={() => go({ at: 'email', address: step.address })}
        />
      )
    case 'password':
      return (
        <PasswordStep
          notice={notice}
          say={setNotice}
          onPassed={passed}
          onForgot={() => go({ at: 'forgot' })}
          onOut={out}
        />
      )
    case 'forgot':
      return (
        <ForgotStep
          notice={notice}
          say={setNotice}
          onBack={(said) => go({ at: 'password' }, said)}
          onOut={out}
        />
      )
  }
}

/** The column every step stands in: its heading, a line under it, then the step. */
function Panel({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <section className="acct">
      <div className="acct-col">
        <h1>{title}</h1>
        {sub && <p className="acct-sub">{sub}</p>}
        {children}
      </div>
    </section>
  )
}

/** Where a step's refusal is said. Always there, so a line arriving never moves the form. */
function Notice({ text }: { text: string | null }) {
  return (
    <p className="acct-notice" role="alert">
      {text}
    </p>
  )
}

function Busy({ busy, children }: { busy: boolean; children: ReactNode }) {
  return busy ? <span className="acct-spin" aria-label="Working" /> : <>{children}</>
}

// ── Email ───────────────────────────────────────────────────────────────

function EmailStep({
  initial,
  notice,
  say,
  onSent,
}: {
  initial: string
  notice: string | null
  say: (text: string | null) => void
  onSent: (address: string) => void
}) {
  const [email, setEmail] = useState(initial)
  const [sending, setSending] = useState(false)
  const [door, setDoor] = useState<Provider | null>(null)
  const captcha = useCaptcha(TURNSTILE_SITE_KEY)
  const held = sending || door !== null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (held || !email.trim()) return
    say(null)
    setSending(true)
    const outcome = await requestCode(email, captcha.token)
    setSending(false)
    if (outcome.kind === 'cancelled') return
    if (outcome.kind !== 'sent') return say(requestNotice(outcome))
    // The address the code went to: lowercased, and the code step checks against the same.
    onSent(outcome.address)
  }

  const open = async (provider: Provider) => {
    if (held) return
    say(null)
    setDoor(provider)
    const outcome = await openDoor(provider)
    if (outcome.kind === 'left') return
    setDoor(null)
    if (outcome.kind === 'unavailable') {
      return say(`Signing in with ${PROVIDER_NAME[provider]} isn’t available yet. Use your email instead.`)
    }
    say(outcome.kind === 'offline' ? OFFLINE : FAILED)
  }

  return (
    <Panel title="Sign in to StageRoll" sub="We’ll email you a code.">
      <form className="acct-form" onSubmit={(event) => void submit(event)} noValidate>
        <input
          className="acct-field"
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            say(null)
            setEmail(event.target.value)
          }}
          placeholder="you@company.com"
          aria-label="Email address"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={EMAIL_MAX}
          disabled={held}
          autoFocus
        />
        <button type="submit" className="pill dark acct-go" disabled={held || !email.trim()} aria-busy={sending}>
          <Busy busy={sending}>Continue</Busy>
        </button>
        {captcha.box}
        <Notice text={notice} />
      </form>

      <div className="acct-or">
        <span>or</span>
      </div>

      <div className="acct-doors">
        <button
          type="button"
          className="pill acct-go"
          disabled={held}
          aria-busy={door === 'apple'}
          onClick={() => void open('apple')}
        >
          <Busy busy={door === 'apple'}>
            <AppleMark />
            Continue with Apple
          </Busy>
        </button>
        <button
          type="button"
          className="pill acct-go"
          disabled={held}
          aria-busy={door === 'google'}
          onClick={() => void open('google')}
        >
          <Busy busy={door === 'google'}>
            <GoogleMark />
            Continue with Google
          </Busy>
        </button>
      </div>

      <p className="acct-small">
        New here? Continuing creates your StageRoll account, and means you agree to the{' '}
        <a href="/terms/">terms of service</a> and the <a href="/privacy/">privacy policy</a>.
      </p>
    </Panel>
  )
}

// ── The code ────────────────────────────────────────────────────────────

function CodeStep({
  address,
  notice,
  say,
  onHeld,
  onPassed,
  onBack,
}: {
  address: string
  notice: string | null
  say: (text: string | null) => void
  onHeld: () => void
  onPassed: () => void
  onBack: () => void
}) {
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const field = useRef<HTMLInputElement>(null)

  const verify = async (entered: string) => {
    if (checking) return
    say(null)
    setChecking(true)
    const outcome = await verifyCode(address, entered)
    setChecking(false)
    switch (outcome.kind) {
      case 'held':
        return onHeld()
      case 'passed':
        return onPassed()
    }
    // A dead code should not have to be deleted digit by digit.
    setCode('')
    say(
      outcome.kind === 'wrong-code'
        ? 'That code isn’t right. Try again, or go back for a new one.'
        : outcome.kind === 'rate-limited'
          ? 'Too many attempts. Wait a few minutes.'
          : outcome.kind === 'blocked'
            ? ACCOUNT_BANNED
            : outcome.kind === 'offline'
              ? OFFLINE
              : FAILED,
    )
    requestAnimationFrame(() => field.current?.focus())
  }

  // The last digit sends it, as in the app: there is nothing a button could add.
  const enter = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH)
    say(null)
    setCode(digits)
    if (digits.length === CODE_LENGTH) void verify(digits)
  }

  return (
    <Panel
      title="Check your email"
      sub={
        <>
          Enter the {CODE_LENGTH}-digit code we sent to <b>{address}</b>.
        </>
      }
    >
      <form
        className="acct-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (code.length === CODE_LENGTH) void verify(code)
        }}
      >
        <input
          ref={field}
          className="acct-field acct-code"
          name="code"
          value={code}
          onChange={(event) => enter(event.target.value)}
          aria-label={`${CODE_LENGTH}-digit code`}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={CODE_LENGTH}
          disabled={checking}
          autoFocus
        />
        <div className="acct-wait-slot">{checking && <span className="acct-spin" aria-label="Checking" />}</div>
        <Notice text={notice} />
      </form>
      <p className="acct-foot">
        <button type="button" className="acct-link" onClick={onBack} disabled={checking}>
          Use a different email
        </button>
      </p>
    </Panel>
  )
}

// ── The password ────────────────────────────────────────────────────────

/** What the step asks for, from the account's password state (the app's `modeOf`). */
type Mode = 'create' | 'apple' | 'enter' | 'reset' | 'locked'

function modeOf(state: PasswordState): Mode {
  if (!state.hasPassword) {
    // An inbox alone never gives an Apple account a password: it is told
    // where to go instead, and adds one from a device that has passed.
    return state.apple ? 'apple' : 'create'
  }
  if (state.resetReadyAt && resetIsReady(state.resetReadyAt)) return 'reset'
  return state.locked ? 'locked' : 'enter'
}

const WORDS: Record<Mode, { title: string; sub: string; action: string }> = {
  create: {
    title: 'Create a password',
    sub: 'You’ll enter it after the code from your email whenever you sign in on a new device.',
    action: 'Continue',
  },
  apple: {
    // A browser has no Apple sheet to pass the session with (the app's web build says the same).
    title: 'Sign in with Apple',
    sub: 'This account uses Sign in with Apple. Sign in on your iPhone, then add a password in Settings to sign in here.',
    action: '',
  },
  enter: { title: 'Enter your password', sub: '', action: 'Continue' },
  reset: {
    title: 'Choose a new password',
    sub: 'Your reset is ready. Every other device signed in to your account will be signed out.',
    action: 'Save password',
  },
  locked: {
    title: 'Too many tries',
    sub: 'Your account is locked after too many wrong passwords. Change it from a device you’re signed in on, or reset it.',
    action: 'Reset password',
  },
}

function PasswordStep({
  notice,
  say,
  onPassed,
  onForgot,
  onOut,
}: {
  notice: string | null
  say: (text: string | null) => void
  onPassed: () => void
  onForgot: () => void
  onOut: (said?: string | null) => Promise<void>
}) {
  const [state, setState] = useState<PasswordState | null>(null)
  const [unread, setUnread] = useState<'offline' | 'failed' | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [entry, setEntry] = useState('')
  const [busy, setBusy] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const leave = useCallback(
    async (said: string | null = null) => {
      setLeaving(true)
      await onOut(said)
    },
    [onOut],
  )

  const read = useCallback(async () => {
    setUnread(null)
    const answer = await readState()
    if (answer.kind === 'ended') return leave(SIGNED_OUT)
    if (answer.kind !== 'read') return setUnread(answer.kind)
    setState(answer.state)
  }, [leave])

  useEffect(() => {
    void read()
    void accountEmail().then(setEmail)
  }, [read])

  const mode = state ? modeOf(state) : null

  const refuse = (text: string) => {
    say(text)
    setEntry('')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!mode || busy || leaving) return
    if (mode === 'locked') return onForgot()
    if (!entry) return
    say(null)
    setBusy(true)
    if (mode === 'enter') {
      const outcome = await checkPassword(entry)
      setBusy(false)
      switch (outcome.kind) {
        case 'passed':
          return onPassed()
        case 'wrong':
          return refuse('That password isn’t right.')
        case 'locked':
        case 'none':
          // The account changed under this step (locked by this try, or a
          // sign-up on another device): ask again what to show.
          setEntry('')
          return read()
        case 'ended':
          return leave(SIGNED_OUT)
        default:
          return refuse(chooseNotice(outcome.kind))
      }
    }
    const outcome = await choosePassword(mode === 'create' ? 'new' : 'reset', entry)
    setBusy(false)
    switch (outcome.kind) {
      case 'passed':
        return onPassed()
      case 'exists':
      case 'apple':
      case 'not-ready':
        setEntry('')
        say(chooseNotice(outcome.kind))
        return read()
      case 'stale':
        // The reset needs the inbox again, now: a new code brings this step
        // back with the reset still ready.
        return leave(chooseNotice('stale'))
      case 'ended':
        return leave(SIGNED_OUT)
      default:
        return refuse(chooseNotice(outcome.kind))
    }
  }

  const signOutLink = (
    <p className="acct-foot">
      <button type="button" className="acct-link" onClick={() => void leave()} disabled={busy || leaving}>
        Sign out
      </button>
    </p>
  )

  if (!mode) {
    if (!unread) return <Wait />
    return (
      <Panel title="Sign in to StageRoll" sub={unread === 'offline' ? OFFLINE : FAILED}>
        <div className="acct-form">
          <button type="button" className="pill dark acct-go" onClick={() => void read()}>
            Try again
          </button>
        </div>
        {signOutLink}
      </Panel>
    )
  }

  const words = WORDS[mode]
  const pending = mode === 'enter' && state?.resetReadyAt ? state.resetReadyAt : null

  return (
    <Panel
      title={words.title}
      sub={mode === 'enter' ? (email ? `For ${email}` : 'For your StageRoll account') : words.sub}
    >
      {mode !== 'apple' && (
        <form className="acct-form" onSubmit={(event) => void submit(event)}>
          {mode !== 'locked' && (
            <>
              {/* The account, for the browser's saved passwords. */}
              <input type="email" name="username" autoComplete="username" value={email ?? ''} readOnly hidden />
              <input
                className="acct-field"
                type="password"
                name="password"
                value={entry}
                onChange={(event) => {
                  say(null)
                  setEntry(event.target.value)
                }}
                placeholder={mode === 'enter' ? 'Password' : `At least ${PASSWORD_MIN} characters`}
                aria-label={mode === 'enter' ? 'Password' : 'New password'}
                autoComplete={mode === 'enter' ? 'current-password' : 'new-password'}
                minLength={mode === 'enter' ? undefined : PASSWORD_MIN}
                disabled={busy || leaving}
                autoFocus
              />
            </>
          )}
          <button
            type="submit"
            className="pill dark acct-go"
            disabled={(mode !== 'locked' && !entry) || leaving}
            aria-busy={busy}
          >
            <Busy busy={busy}>{words.action}</Busy>
          </button>
          <Notice text={notice} />
        </form>
      )}
      {mode === 'apple' && <Notice text={notice} />}

      {pending && (
        <p className="acct-small">
          A password reset is under way. You can choose a new password from {readyLabel(pending)}.
        </p>
      )}
      {mode === 'enter' && (
        <p className="acct-foot">
          <button type="button" className="acct-link" onClick={onForgot} disabled={busy || leaving}>
            Forgot password?
          </button>
        </p>
      )}
      {signOutLink}
    </Panel>
  )
}

// ── Forgot password ─────────────────────────────────────────────────────

/**
 * A reset waits a day (the app's `forgot.tsx`): asked for now, every device
 * still signed in hears it and can cancel it, and a day later a new code
 * brings the person back to the password step, which asks for a new one.
 */
function ForgotStep({
  notice,
  say,
  onBack,
  onOut,
}: {
  notice: string | null
  say: (text: string | null) => void
  onBack: (said?: string | null) => void
  onOut: (said?: string | null) => Promise<void>
}) {
  const [readyAt, setReadyAt] = useState<string | null>(null)
  const [known, setKnown] = useState(false)
  const [busy, setBusy] = useState<'start' | 'cancel' | null>(null)
  const [leaving, setLeaving] = useState(false)

  const leave = useCallback(
    async (said: string | null = null) => {
      setLeaving(true)
      await onOut(said)
    },
    [onOut],
  )

  // A reset already under way shows its time rather than offering another.
  useEffect(() => {
    void readState().then((answer) => {
      if (answer.kind === 'ended') return leave(SIGNED_OUT)
      if (answer.kind === 'read') setReadyAt(answer.state.resetReadyAt)
      setKnown(true)
    })
  }, [leave])

  const start = async () => {
    if (busy || leaving) return
    say(null)
    setBusy('start')
    const outcome = await requestReset()
    setBusy(null)
    switch (outcome.kind) {
      case 'requested':
        return setReadyAt(outcome.readyAt)
      case 'none':
        // No password to reset: the step behind makes one.
        return onBack()
      case 'ended':
        return leave(SIGNED_OUT)
      default:
        say(outcome.kind === 'offline' ? OFFLINE : FAILED)
    }
  }

  const cancel = async () => {
    if (busy || leaving) return
    say(null)
    setBusy('cancel')
    const outcome = await cancelReset()
    setBusy(null)
    if (outcome.kind === 'cancelled' || outcome.kind === 'none') return onBack('Reset cancelled.')
    if (outcome.kind === 'ended') return leave(SIGNED_OUT)
    say(outcome.kind === 'offline' ? OFFLINE : FAILED)
  }

  if (!known) return <Wait />

  if (readyAt) {
    return (
      <Panel title="Reset under way">
        <p className="acct-body">
          You can choose a new password from {readyLabel(readyAt)}. Sign in again then, and you’ll be asked for one.
        </p>
        <p className="acct-body">Your signed-in devices have been told, so it can be cancelled if it wasn’t you.</p>
        <div className="acct-form">
          <button type="button" className="pill dark acct-go" onClick={() => void leave()} disabled={busy !== null}>
            <Busy busy={leaving}>Done</Busy>
          </button>
          <Notice text={notice} />
        </div>
        <p className="acct-foot">
          <button type="button" className="acct-link" onClick={() => void cancel()} disabled={busy !== null || leaving}>
            Cancel reset
          </button>
        </p>
      </Panel>
    )
  }

  return (
    <Panel title="Reset your password">
      <p className="acct-body">
        For your security, a reset takes 24 hours. Your signed-in devices are told straight away, so it can be
        cancelled if it wasn’t you.
      </p>
      <p className="acct-body">
        Still signed in on another device? Change your password there instead, in Settings. It’s instant.
      </p>
      <div className="acct-form">
        <button type="button" className="pill dark acct-go" onClick={() => void start()} disabled={leaving}>
          <Busy busy={busy === 'start'}>Start reset</Busy>
        </button>
        <Notice text={notice} />
      </div>
      <p className="acct-foot">
        <button type="button" className="acct-link" onClick={() => onBack()} disabled={busy !== null || leaving}>
          Back
        </button>
      </p>
    </Panel>
  )
}

// ── The providers' marks ────────────────────────────────────────────────

/** Apple's glyph takes the button's ink, as Apple's own button does. */
function AppleMark() {
  return (
    <svg className="acct-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702"
      />
    </svg>
  )
}

/** Google's G keeps its own colours: a brand's mark is not ours to theme. */
function GoogleMark() {
  return (
    <svg className="acct-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}
