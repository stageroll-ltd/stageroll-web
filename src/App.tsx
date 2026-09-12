import { Stores } from "./stores";

// From public/, by a relative path: the server render and the browser then
// write the same src, and it resolves at the domain's root and the
// github.io/<repo>/ preview alike.
const wordmark = "./brand/wordmark-dark.svg";

// The holding page: the wordmark, "Coming soon", one line, a way to reach
// us, and the company details the UK requires at the foot.
// When the marketing site arrives this becomes the home route.
export function App() {
  return (
    <div className="shell">
      <div className="grain" aria-hidden="true" />

      <header className="top">
        <h1 className="brand">
          <img src={wordmark} alt="StageRoll" width={456} height={124} />
        </h1>
      </header>

      <main className="centre">
        <h2 className="soon">Coming soon</h2>
        <p className="line">
          Modern production management for theatre, film and live events
        </p>
        <Stores />
        {/* The wordmark's tally: to do, shooting, done — rolling. */}
        <p className="tally" aria-hidden="true">
          <span className="tally-todo" />
          <span className="tally-shooting" />
          <span className="tally-done" />
        </p>
      </main>

      <footer className="foot">
        <p className="contact">
          Contact:{" "}
          <a className="mail" href="mailto:hello@stageroll.co">
            hello@stageroll.co
          </a>
        </p>
        <p>
          StageRoll Ltd is a company registered in England and Wales. Company
          number 17436723. Registered office: 124-128 City Road, London, EC1V
          2NX.
        </p>
        <p>This site sets no cookies and collects no personal data.</p>
      </footer>
    </div>
  );
}
