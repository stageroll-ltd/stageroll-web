import { company } from '../Layout'

// The terms for StageRoll as it will be at launch, written to match the
// privacy policy (Privacy.tsx), which also describes the launch state. A
// draft: a solicitor reviews both before launch (stageroll-docs #40), and the
// re-audit (#41) checks them against the app. Change the two together.

export function Terms() {
  return (
    <article className="prose">
      <h1>Terms of service</h1>
      <p className="updated">Last updated 13 October 2026</p>

      <h2>The service</h2>
      <p>
        StageRoll is production management software for the costume, props, hair, makeup and sets
        departments on productions of any size: script reading, scenes, continuity, research,
        inventory, the schedule and reports, shared within a production&rsquo;s team. It is provided
        by {company.name}, a company registered in England and Wales, company number{' '}
        {company.number}.
      </p>
      <p>
        These terms are between us and you. If you use StageRoll for a company or a production, you
        accept them for it too, and you confirm you&rsquo;re allowed to.
      </p>

      <h2>Who can use it</h2>
      <p>
        You must be 16 or over. Your account is for you alone: don&rsquo;t share it or your sign-in
        codes.
      </p>

      <h2>Your account</h2>
      <p>
        You sign in with a one-time code sent to your email, with Apple or Google, or through your
        organisation&rsquo;s sign-in service. Keep your device and your PIN secure. You&rsquo;re
        responsible for what happens under your account, and you should tell us straight away if you
        think someone else has used it.
      </p>

      <h2>Productions and roles</h2>
      <p>
        Whoever creates a production owns it. The owner chooses its plan and manages its team, and
        can hand the production over to another member. The owner and coordinators are responsible
        for inviting the right people, and for removing anyone who should no longer have access.
      </p>

      <h2>Your content</h2>
      <p>
        Everything your team puts into a production belongs to you and your production, not to us.
        You give us permission to store, process and show it only so we can provide StageRoll to you
        and your team. In the app, a production&rsquo;s content is shown only to its members. We
        never sell your content, use it for advertising, or use it to train AI. How we handle
        personal data is in our <a href="/privacy/">privacy policy</a>.
      </p>

      <h2>Personal data in a production</h2>
      <p>
        A production&rsquo;s content can include information about people, including people who
        don&rsquo;t use StageRoll, such as cast. The company or person running the production is the
        controller of that information, and of the access log on a production with enhanced
        security. We process it on their behalf, under the data processing terms below.
      </p>
      <p>
        If you run a production, you confirm that you have a lawful basis for what your team records
        about people, including anything sensitive, such as health information in a note; that you
        have told those people what is recorded and why; and that you&rsquo;ll deal with their
        requests about it.
      </p>

      <h2>Data processing terms</h2>
      <p>For personal data we process on a production&rsquo;s behalf, we:</p>
      <ul>
        <li>
          process it only to provide StageRoll, as these terms and your use of the app instruct,
          unless the law requires otherwise, in which case we&rsquo;ll tell you unless the law
          forbids it;
        </li>
        <li>make sure everyone who can reach it is bound to keep it confidential;</li>
        <li>keep it secure, as our privacy policy describes;</li>
        <li>
          use only the providers in our provider list, available on request, under contracts that
          give the same protection, and tell production owners before we add or replace one, so
          they can object;
        </li>
        <li>help you answer requests from the people it&rsquo;s about, and with any assessment or consultation the law requires;</li>
        <li>tell the production&rsquo;s owner without undue delay if a breach affects it;</li>
        <li>
          delete it when the production is deleted, after its 30 days in Recently deleted, with
          copies in backups and logs gone within a further 30 days;
        </li>
        <li>give you the information you need to show this is being done, and allow reasonable audits.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Use StageRoll for productions you&rsquo;re actually part of. Don&rsquo;t try to reach other
        productions&rsquo; data, probe or overload the service, copy or take apart the app, use it to
        store anything unlawful or anything you have no right to hold, or resell it.
      </p>
      <p>
        If we suspect these rules are being broken, we may look into it using the records our
        privacy policy describes, and we may suspend or close the accounts or productions involved.
        We&rsquo;ll tell you why, unless the law stops us.
      </p>

      <h2>Plans and payment</h2>
      <p>
        Every crew account is free. Plans are per production: the free plan, and paid plans as shown
        on our <a href="/pricing/">pricing page</a> when you buy, plus VAT where it applies.
      </p>
      <p>
        Starter and Pro are billed monthly in advance by card, and renew each month until they are
        cancelled. You can cancel at any time, and the plan ends at the close of the month
        you&rsquo;ve paid for; we don&rsquo;t refund part months unless the law requires it.
        We&rsquo;ll email you at least 30 days before a price change. If a payment fails and
        isn&rsquo;t put right after we&rsquo;ve told you, we may move the production to the free plan.
      </p>
      <p>
        Enterprise is billed by invoice or purchase order, for the length and on the terms agreed in
        its own contract. Where that contract differs from these terms, the contract applies.
      </p>
      <p>
        Moving to a smaller plan never deletes work. Anything over a limit stays, and you can add
        more once you&rsquo;re back under it. If the team is bigger than the new plan&rsquo;s seats,
        its members are removed and can be invited again up to the new limit.
      </p>

      <h2>Our software</h2>
      <p>
        We own StageRoll, apart from your content. While these terms apply, you may use it for your
        productions; that right is yours alone and can&rsquo;t be transferred. If you send us ideas
        or feedback, we may use them freely.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep StageRoll available and your data safe, but we can&rsquo;t promise it will
        always be available or free of errors, and it is provided as it is. We may change or remove
        features. If we ever close StageRoll altogether, we&rsquo;ll email account holders at least
        60 days before.
      </p>

      <h2>Our liability</h2>
      <p>
        Nothing in these terms limits our liability for death or personal injury caused by our
        negligence, for fraud, or for anything else the law doesn&rsquo;t allow us to limit.
      </p>
      <p>
        Otherwise, we aren&rsquo;t liable for indirect or consequential loss, or for loss of profit,
        revenue, business or goodwill. For everything that happens in any 12-month period, the most
        we&rsquo;ll pay you and your production in total is what the production paid us in the 12
        months before the first claim, or &pound;100 if that is more.
      </p>

      <h2>Ending things</h2>
      <p>
        You can delete your account in the app at any time, or ask us to do it for you. Deletion
        takes effect straight away and can&rsquo;t be undone; our privacy policy says what goes and
        what stays. If you own a production that other people are on, hand it over to one of them
        first, so no team is left without an owner.
      </p>
      <p>
        We may suspend or close an account or a production that breaks these terms, as acceptable
        use describes. The parts of these terms that are meant to last, such as our liability, carry
        on after an account closes.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        If we change these terms in a way that matters, we&rsquo;ll email account holders at least 30
        days before the change takes effect. If you keep using StageRoll after that, the new terms
        apply. The date at the top shows when they last changed.
      </p>

      <h2>General</h2>
      <p>
        If part of these terms can&rsquo;t be enforced, the rest still applies. We may transfer these
        terms to a business that takes over StageRoll, and we&rsquo;ll tell you if we do. No one else
        has rights under them.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the law of England and Wales, and its courts decide any dispute.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </article>
  )
}
