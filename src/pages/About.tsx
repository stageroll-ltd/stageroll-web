import { company } from '../Layout'

export function About() {
  return (
    <article className="prose">
      <h1>About StageRoll</h1>
      <p className="lede">
        StageRoll Ltd is an independent software company registered in England and Wales. We make
        StageRoll, production management software for the costume, props, hair and makeup
        departments of film and television.
      </p>

      <h2>Why it exists</h2>
      <p>
        A department&rsquo;s record of a production is scattered: the script in one app, the
        breakdown in a spreadsheet, continuity photographs across several camera rolls, the
        schedule on a call sheet, and the whereabouts of any given item in someone&rsquo;s head.
        Finding out what scene 24A needs, or which crate the logbook went back into, takes a radio
        call and a search.
      </p>
      <p>
        StageRoll keeps that record in one place, and keeps it current. The script is read once and
        becomes the scenes and characters everything else hangs off. Each change, item and
        photograph is tied to the scenes it serves. The schedule, the research and the paperwork
        come from the same production, so a redraft on Tuesday is in the report on Wednesday.
      </p>

      <h2>How we build it</h2>
      <p>
        The phone is the canonical surface. Set work happens standing up, with one hand, in a
        hurry, so every workflow is settled on the phone first. Script reading runs on the device,
        and the app is native rather than a web page in a shell, so it moves at the speed of the
        screen.
      </p>
      <p>
        Your content is yours. Scripts, breakdowns, photographs and records stay private to the
        members of the production. We do not sell data, show advertising, or train models on
        customer content. The details are in our <a href="/privacy/">privacy policy</a>.
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
