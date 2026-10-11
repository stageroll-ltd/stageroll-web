import { company } from '../Layout'

export function Terms() {
  return (
    <article className="prose">
      <h1>Terms of service</h1>
      <p className="updated">Last updated 21 September 2026</p>

      <h2>The service</h2>
      <p>
        StageRoll is production management software for the costume, props, hair and makeup
        departments of film and television: script reading, scenes, continuity, inventory, the
        schedule, research and reports, shared within a production's team. It is provided by {company.name}, a company registered in England
        and Wales.
      </p>

      <h2>Your account</h2>
      <p>
        You sign in with your email address and a one-time code. You are responsible for what
        happens under your account, and for making sure the people you invite to a production
        should be there.
      </p>

      <h2>Your content</h2>
      <p>
        Everything your team puts into a production belongs to you and your production, not to us.
        Scripts, breakdowns, photos and records stay private to the members of that production. We
        never sell your content, use it for advertising, or train models on it. How we handle
        personal data is in our <a href="/privacy/">privacy policy</a>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Use StageRoll for productions you are actually part of. Do not attempt to access other
        productions' data, probe the service for weaknesses, or use it to store material you have no
        right to hold.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep StageRoll available and your data safe, but the service is provided as is,
        without warranty. We may change or discontinue features. If a change materially affects how
        your data is handled, we will tell you first.
      </p>

      <h2>Ending things</h2>
      <p>
        You can delete your account from the app, or by writing to us, at any time. Deletion is
        scheduled with a 14-day grace period, after which your account and personal data are
        removed.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the law of England and Wales.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </article>
  )
}
