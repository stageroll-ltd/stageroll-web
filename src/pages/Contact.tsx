import { company } from '../Layout'

export function Contact() {
  return (
    <article className="prose">
      <h1>Contact</h1>
      <p className="lede">
        One address for everything: questions about the product, trying StageRoll on a production,
        support, press and privacy requests.
      </p>

      <h2>Email</h2>
      <p>
        <a href={`mailto:${company.email}`}>{company.email}</a>
      </p>
      <p className="quiet">We reply within a few working days.</p>

      <h2>Post</h2>
      <p>
        {company.name}
        <br />
        {company.address.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>

      <h2>Company</h2>
      <p>
        {company.name} is a company registered in England and Wales, company number {company.number}.
      </p>
    </article>
  )
}
