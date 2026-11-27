import type { ReactNode } from 'react'

import { accountPages } from '../account/pages'
import { company } from '../Layout'

/**
 * Help: how to do the common things, as numbered steps, one action a step,
 * each starting with its verb, the app's words for its buttons and rows in
 * bold (user call 2026-11-04). The topics
 * stand at the top, grouped, as links to each.
 *
 * The app opens this page from its Help row (with ?from=app), and there
 * the web's Upgrade topic is `sells`, its link at the top too, so the app's
 * sheet never shows its links to Pricing and the account pages
 * (styles.css). It says how a plan moves on THIS build: on the account
 * pages where they are on, by writing to us where they are not
 * (`account/pages.ts`). In the app's sheet a second Upgrade topic stands
 * in its place (`appOnly`): the same words the app's own Upgrade button
 * says, and no link (user call, 2026-11-12, a risk taken on purpose with
 * App Review; stageroll-native `src/plans/upgrade.ts`). If the review
 * refuses the button, this topic goes with it.
 *
 * Every step was checked against stageroll-native when it was written
 * (2026-11-04): the picture at the top of Home opens the account sheet,
 * whose name row is Profile and whose Preferences row is the Settings page.
 * A step changes when the app does.
 */

type Topic = {
  id: string
  title: string
  /** One line before the steps: who, or what to know first. */
  intro?: ReactNode
  steps?: ReactNode[]
  /** A plain answer instead of steps. */
  answer?: ReactNode
  note?: ReactNode
  sells?: boolean
  /** Shown only where the app opened the page (`.app-only`). */
  appOnly?: boolean
}

/** A topic's class beside the list's or the section's own: gone in the app, or there alone. */
const where = (topic: Topic, base = ''): string | undefined =>
  [base, topic.sells ? 'sells' : '', topic.appOnly ? 'app-only' : ''].filter(Boolean).join(' ') || undefined

const mail = <a href={`mailto:${company.email}`}>{company.email}</a>

/** The account sheet's Settings door, the first step of most topics. */
const openSettings = (
  <>
    Tap your picture at the top of Home, then <b>Preferences</b>.
  </>
)

const groups: { title: string; topics: Topic[] }[] = [
  {
    title: 'Your team',
    topics: [
      {
        id: 'join',
        title: 'Join a production',
        intro: 'Its owner or a coordinator invites you.',
        steps: [
          'Give them the email address you use for StageRoll, or let them scan your code.',
          'When the invite arrives, tap the bell at the top of Home.',
          <>
            Tap <b>Accept</b>.
          </>,
        ],
        note: 'Your code is on your profile: tap your picture at the top of Home, then your name.',
      },
      {
        id: 'upgrade',
        title: 'Upgrade a production',
        sells: true,
        intro: (
          <>
            <b>You upgrade a production, not your account.</b> Each production has its own plan, and
            only its owner changes it. Every account is free, yours and your team&rsquo;s. The{' '}
            <a href="/pricing/">pricing page</a> shows what each plan holds.
          </>
        ),
        steps: accountPages
          ? [
              <>
                <b>Sign in</b> at the top of this page, with the owner&rsquo;s account.
              </>,
              'Pick the production.',
              'Choose its new plan, and pay by card.',
            ]
          : [
              <>Email {mail} from the owner&rsquo;s address.</>,
              'Say which production, and which plan.',
            ],
        note: accountPages
          ? <>For Enterprise, email {mail}. A plan isn&rsquo;t changed in the app.</>
          : 'We set it up, and the app shows the new plan. A plan isn’t changed in the app.',
      },
      {
        /* The app's sheet: words only, the app's own (`plans/upgrade.ts`). */
        id: 'upgrade-from-app',
        title: 'Upgrade a production',
        appOnly: true,
        intro: (
          <>
            <b>You upgrade a production, not your account.</b> Each production has its own plan, and
            only its owner changes it. A bigger plan brings your whole crew in, with room for more
            items, photos and script readings.
          </>
        ),
        answer: (
          <>
            Upgrading is currently disabled through the app. Sign in to <b>stageroll.co</b> on a
            computer to unlock your studio&rsquo;s potential.
          </>
        ),
      },
    ],
  },
  {
    title: 'Your account',
    topics: [
      {
        id: 'password',
        title: 'Change your password',
        steps: [
          openSettings,
          <>
            Tap <b>Password</b>, then <b>Change password</b>.
          </>,
          'Confirm with Face ID or your PIN.',
          <>
            Enter the new password, then tap <b>Save password</b>.
          </>,
        ],
        note: 'Every other device signed in to your account is signed out.',
      },
      {
        id: 'forgot',
        title: 'Reset a forgotten password',
        intro: (
          <>
            Still signed in on a device? <a href="#password">Change it there</a> instead.
          </>
        ),
        steps: [
          'Sign in with your email and the code we send.',
          <>
            Tap <b>Forgot password?</b>, then <b>Start reset</b>.
          </>,
          'A day later, sign in with a new code and choose your new password.',
        ],
        note: 'The day’s wait means your email alone can’t take your account. Any device signed in to it is told, and can cancel the reset.',
      },
      {
        id: 'lost-device',
        title: 'Sign out a lost device',
        steps: [
          <>
            On another device, tap your picture at the top of Home, then <b>Preferences</b>.
          </>,
          <>
            Tap <b>Signed-in devices</b>.
          </>,
          <>
            Tap the lost device, then <b>Sign out</b>.
          </>,
        ],
        note: <>A device left unused for 90 days is signed out on its own. No other device? Email {mail}.</>,
      },
      {
        id: 'restore',
        title: 'Restore a deleted production',
        intro: 'A deleted production waits 30 days before it’s gone for good.',
        steps: [
          openSettings,
          <>
            Tap <b>Recently deleted</b>.
          </>,
          <>
            Tap the production, then <b>Restore</b>.
          </>,
        ],
        note: 'Its team gets it back too.',
      },
      {
        id: 'delete-account',
        title: 'Delete your account',
        steps: [
          'Tap your picture at the top of Home, then your name.',
          <>
            Tap <b>Delete account</b>, then <b>Continue</b>.
          </>,
          <>
            Enter your password, then tap <b>Delete account</b>. Signed in with Apple? Tap{' '}
            <b>Delete with Apple</b>.
          </>,
        ],
        note: 'It happens at once and can’t be undone. A production you own that still has a team, or whose plan renews, is settled first: the app lists them.',
      },
    ],
  },
  {
    title: 'Privacy',
    topics: [
      {
        id: 'who-sees',
        title: 'Who can see a production?',
        answer:
          'Only the people on it. Photos are stored privately, with their location and camera details removed before they’re uploaded.',
      },
      {
        id: 'scripts',
        title: 'Is my script uploaded?',
        answer: 'No. It’s read on your phone and the file never leaves it. Only the scene list and the cast are kept.',
      },
    ],
  },
]

export function Help() {
  return (
    <article className="prose help">
      <h1>Help</h1>
      <p className="lede">How to do the common things in StageRoll.</p>
      {/* Only where the app opened this page: words, never a link (a link would stay in
          the app's sheet, `in-app` with it). */}
      <p className="help-note app-only">
        To see all of Help, open <b>stageroll.co/help</b> in your browser.
      </p>

      <nav className="help-topics" aria-label="Topics">
        {groups.map((group) => (
          <div key={group.title}>
            <p>{group.title}</p>
            <ul>
              {group.topics.map((topic) => (
                <li key={topic.id} className={where(topic)}>
                  <a href={`#${topic.id}`}>{topic.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {groups.map((group) =>
        group.topics.map((topic) => (
          <section
            key={topic.id}
            id={topic.id}
            className={where(topic, 'help-topic')}
            aria-labelledby={`${topic.id}-title`}
          >
            <h2 id={`${topic.id}-title`}>{topic.title}</h2>
            {topic.intro ? <p>{topic.intro}</p> : null}
            {topic.steps ? (
              <ol className="help-steps">
                {topic.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : null}
            {topic.answer ? <p>{topic.answer}</p> : null}
            {topic.note ? <p className="help-note">{topic.note}</p> : null}
          </section>
        )),
      )}

      <section className="help-topic" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Still stuck?</h2>
        <p>
          Email {mail}. We reply within a few working days.
        </p>
      </section>
    </article>
  )
}
