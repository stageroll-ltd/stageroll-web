import { Icon } from '../components/Icon'
import { PageClose, PageHero } from '../components/Page'
import type { DepartmentPage, Story } from './departments'

// A department page told as a landing page (departments.ts, `story`): an
// opening, three facts, what the department keeps, a moment on the day, its
// paperwork, the questions people ask and the way on. Each band has its own
// shape on purpose; the pictures and the finer design follow the home page's.
//
// The page has the home page's look: its column and rails, its two-voice
// opening and its square buttons (components/Page.tsx, `.fr` in product.css).

export function Department({ page, story }: { page: DepartmentPage; story: Story }) {
  return (
    <div className="prod dept hm fr">
      <PageHero
        kicker={
          <>
            <a href="/product/">Product</a> <span aria-hidden="true">/</span> {page.title}
          </>
        }
        heading={story.headline}
        text={page.lede}
      >
        <a className="hm-btn dark sells" href="/pricing/">
          See pricing <Icon name="chevron" />
        </a>
        <a className="hm-btn" href="/product/">
          See the product
        </a>
      </PageHero>

      <section className="dept-band" aria-labelledby="dept-intro">
        <div className="hm-col fr-in">
          <h2 id="dept-intro">{story.intro.heading}</h2>
          <div className="dept-two">
            {story.intro.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-band" aria-label="In short">
        <div className="hm-col fr-in">
          <ul className="dept-facts">
            {story.facts.map(([lead, text]) => (
              <li key={lead}>
                <h3>{lead}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dept-band" aria-labelledby="dept-areas">
        <div className="hm-col fr-in">
          <div className="dept-head">
            <h2 id="dept-areas">{story.areas.heading}</h2>
            <p className="lede">{story.areas.lede}</p>
          </div>
          <ul className="dept-areas">
            {story.areas.items.map((item) => (
              <li key={item.name}>
                <h3>
                  <a href={item.href}>
                    {item.name} <Icon name="chevron" />
                  </a>
                </h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dept-band tint" aria-labelledby="dept-moment">
        <div className="hm-col fr-in">
          <div className="dept-moment">
            <h2 id="dept-moment">{story.moment.heading}</h2>
            {story.moment.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-band" aria-labelledby="dept-papers">
        <div className="hm-col fr-in">
          <div className="dept-head">
            <h2 id="dept-papers">{story.papers.heading}</h2>
            <p className="lede">{story.papers.lede}</p>
          </div>
          <ul className="dept-facts cards">
            {story.papers.items.map(([name, text]) => (
              <li key={name}>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
          <p className="dept-more">
            <a href={story.papers.href}>
              See every report <Icon name="chevron" />
            </a>
          </p>
        </div>
      </section>

      <section className="dept-band" aria-labelledby="dept-questions">
        <div className="hm-col fr-in dept-faq">
          <h2 id="dept-questions">Questions</h2>
          <dl>
            {story.questions.map(([question, answer]) => (
              <div key={question}>
                <dt>{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PageClose id="dept-next" />
    </div>
  )
}
