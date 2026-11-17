import { Icon } from "../components/Icon";
import type { DepartmentPage, Story } from "./departments";

// A department page told as a landing page (departments.ts, `story`): an
// opening, three facts, what the department keeps, a moment on the day, its
// paperwork, the questions people ask and the way on. Each band has its own
// shape on purpose; the pictures and the finer design follow the home page's.
//
// A framed page (`framed`, set by the route and matched in Layout.tsx) takes
// the home page's look: its column and rails, its two-voice opening and its
// square buttons (home.css, then `.dept.hm` in product.css).

export function Department({
  page,
  story,
  framed,
}: {
  page: DepartmentPage;
  story: Story;
  framed?: boolean;
}) {
  // The column each band's words sit in.
  const wrap = framed ? "hm-col dept-in" : "wrap";
  const crumb = (
    <>
      <a href="/product/">Product</a> <span aria-hidden="true">/</span>{" "}
      {page.title}
    </>
  );
  return (
    <div className={framed ? "prod dept hm" : "prod dept"}>
      {framed && <div className="hm-rails" aria-hidden="true" />}

      {framed ? (
        <section className="hm-hero dept-hero">
          <div className="hm-col hm-hero-in">
            <p className="hm-kicker">{crumb}</p>
            {/* The headline, then the sentence that runs on from it in the second colour. */}
            <div className="hm-two hm-lead">
              <h1>{story.headline}</h1> <p>{page.lede}</p>
            </div>
            <div className="hm-acts">
              <a className="hm-btn dark sells" href="/pricing/">
                See pricing <Icon name="chevron" />
              </a>
              <a className="hm-btn" href="/product/">
                See the product
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="prod-hero">
          <div className="wrap">
            <p className="dept-crumb">{crumb}</p>
            <h1>{story.headline}</h1>
            <p className="lede">{page.lede}</p>
          </div>
        </section>
      )}

      <section className="dept-band" aria-labelledby="dept-intro">
        <div className={wrap}>
          <h2 id="dept-intro">{story.intro.heading}</h2>
          <div className="dept-two">
            {story.intro.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-band" aria-label="In short">
        <div className={wrap}>
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
        <div className={wrap}>
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
        <div className={wrap}>
          <div className="dept-moment">
            <h2 id="dept-moment">{story.moment.heading}</h2>
            {story.moment.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-band" aria-labelledby="dept-papers">
        <div className={wrap}>
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
        <div className={`${wrap} dept-faq`}>
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

      {framed ? (
        <section className="hm-close dept-close" aria-labelledby="dept-next">
          <div className="hm-col">
            <h2 id="dept-next">Ready for your next production.</h2>
            <p>Plans are per production, and every crew account is free.</p>
            <div className="hm-acts">
              <a className="hm-btn dark sells" href="/pricing/">
                See pricing
              </a>
              <a className="hm-btn" href="/contact/">
                Get in touch <Icon name="chevron" />
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="prod-sec tint prod-end" aria-labelledby="dept-next">
          <div className="wrap">
            <div className="prod-center">
              <h2 id="dept-next">Ready for your next production.</h2>
              <p className="lede">
                Plans are per production, and every crew account is free.
              </p>
              <div className="acts">
                <a className="pill dark sells" href="/pricing/">
                  See pricing
                </a>
                <a className="pill" href="/contact/">
                  Get in touch <Icon name="chevron" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
