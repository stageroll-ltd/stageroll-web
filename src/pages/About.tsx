import { company } from '../Layout'

export function About() {
  return (
    <article className="prose">
      <h1>About StageRoll</h1>
      <p className="lede">
        StageRoll Ltd is an independent software company registered in England and Wales. We make
        StageRoll, production management software for the costume, props, hair, makeup and sets
        departments on productions of any size.
      </p>

      <h2>Why it exists</h2>
      <p>
        A department&rsquo;s record of a production is scattered: the script in one app, the
        breakdown in a spreadsheet, continuity photos across several camera rolls, the schedule on
        a call sheet, and the whereabouts of any given item in someone&rsquo;s head. Finding out
        what a scene needs, or which crate something went back into, takes a radio call and a
        search.
      </p>
      <p>
        StageRoll keeps that record in one place, and keeps it current. The script becomes the
        scenes and characters everything else hangs off, and each new draft updates them without
        losing work. Every change, style, look, prop and photo is tied to the scenes it serves. The
        schedule, the research and the paperwork come from the same production, so a new draft on
        Tuesday is in the reports on Wednesday.
      </p>

      <h2>How we build it</h2>
      <p>
        Set work happens standing up, with one hand, in a hurry. So StageRoll is made for the phone
        or tablet you already carry, on iPhone, iPad and Android, and what you&rsquo;ve opened stays
        readable when the signal drops. The script is read on your own device, and the file is
        never uploaded.
      </p>
      <p>
        A production&rsquo;s work stays private. In the app, breakdowns, photos and records are
        shown only to the people on the production. We don&rsquo;t sell data, show ads, or use your
        work to train AI. The details are in our <a href="/privacy/">privacy policy</a>.
      </p>

      <h2>Company details</h2>
      <dl>
        <dt>Legal name</dt>
        <dd>{company.name}</dd>
        <dt>Registered in</dt>
        <dd>England and Wales, company number {company.number}</dd>
        <dt>Registered office</dt>
        <dd>{company.address.join(', ')}</dd>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </dd>
      </dl>
    </article>
  )
}
