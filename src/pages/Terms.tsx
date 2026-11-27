import { company } from '../Layout'

// The terms for StageRoll, written to match the privacy policy
// (Privacy.tsx) and by the same rule (owner's call, 27 November 2026):
// room in it, few hard promises, broad is fine and false is not. A draft:
// a solicitor reviews both before launch (stageroll-docs #40), and the
// re-audit (#41) checks them against the app. Change the two together.
//
// NO FIXED NOTICE PERIODS (owner, 27 November 2026: "just loosen them").
// A change to the terms or a price, and closing StageRoll, are told "in
// advance" with no number of days. Do not write one back. What makes a
// change hold without a number is the line that anyone who does not accept
// it can leave before it applies: keep that line.
//
// Still hard, left for the solicitor: no refunds for part months, the
// 30 + 30 days in the data processing terms, and the liability cap.
//
// ADDED FROM A COMPARISON WITH ANOTHER APP'S TERMS (owner agreed, same
// day; the list is a comment on #40). All of it protects us, none of it
// is a promise by us: the uploader has the right to what they add; members
// keep a production's content inside it; no bots, no getting round limits
// or checks, no harassment; we may remove content, and act at once when it
// is serious; deleting the app does not cancel a plan; counts and reports
// are to be checked; keep your own copies; things outside our control;
// other companies' sites and services; a business covers claims its team
// causes (NOT individuals: against a consumer it would not hold); the
// whole agreement; notices by email or in the app. The liability cap was
// not touched.
//
// LOST OR STOLEN DEVICES (owner, same day): the member signs the device
// out, the owner and coordinators remove them from the production, and we
// are not responsible for what is seen through a device or sign-in that
// was not kept safe. Three places: Your account, Productions and roles.

export function Terms() {
  return (
    <article className="prose">
      <h1>Terms of service</h1>
      <p className="updated">Last updated 27 November 2026</p>

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
        accept them for it too, and you confirm you&rsquo;re allowed to. We may change them at any
        time; the date above shows when they last changed.
      </p>

      <h2>Who can use it</h2>
      <p>
        You must be 16 or over, and we may close an account that belongs to someone younger. Your
        account is for you alone: don&rsquo;t share it or your sign-in codes.
      </p>

      <h2>Your account</h2>
      <p>
        You sign in with a one-time code sent to your email and your password, or through another
        sign-in service the app offers, such as Apple or Google. Keep your device, your password and
        your PIN secure, and keep the details you give us true and up to date. You&rsquo;re
        responsible for what happens under your account, and you should tell us straight away if you
        think someone else has used it.
      </p>
      <p>
        If a device you&rsquo;re signed in on is lost or stolen, or someone else can get into it,
        sign that device out as soon as you can, or ask us to, and tell the people who run your
        productions. We aren&rsquo;t responsible for what anyone sees or does through a device that
        is lost, stolen, shared or left unlocked, or through an account whose sign-in someone else
        has got hold of.
      </p>

      <h2>Productions and roles</h2>
      <p>
        Whoever creates a production owns it. The owner chooses its plan and manages its team, and
        where the app offers it, can hand the production over to another member. The owner and
        coordinators are responsible for inviting the right people, and for removing anyone who
        should no longer have access.
        That includes a member whose device has been lost or stolen, or whose account someone else
        may have got into, until it is safe again.
      </p>

      <h2>Your content</h2>
      <p>
        Everything your team puts into a production belongs to you and your production, not to us.
        You give us permission to store, process and show it only so we can provide, support and
        protect StageRoll for you and your team. Our providers and their tools may handle it for
        that. In the app, a production&rsquo;s content is shown only to its members. We never sell
        your content or use it for advertising. How we handle personal data is in our{' '}
        <a href="/privacy/">privacy policy</a>.
      </p>
      <p>
        Whoever adds something to a production is responsible for it, and confirms they have the
        right to add it. That includes photos of people, and pictures, links and files that come
        from somewhere else. Members should keep a production&rsquo;s content within the production.
        What a member does with it is between them and the production, not us.
      </p>

      <h2>Personal data in a production</h2>
      <p>
        A production&rsquo;s content can include information about people, including people who
        don&rsquo;t use StageRoll, such as cast. The company or person running the production is the
        controller of that information, and of any record the production keeps of who opened
        what. We process it on their behalf, under the data processing terms below.
      </p>
      <p>
        If you run a production, you confirm that you have a lawful basis for what your team records
        about people, including children and anything sensitive, such as health information in a note; that you
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
        productions&rsquo; data, probe or overload the service, use bots or scripts to sign in or
        pull data out, get round a plan&rsquo;s limits or the sign-in, PIN or payment checks, copy
        or take apart the app, use it to store anything unlawful or anything you have no right to
        hold, use it to harass or abuse anyone, or resell it.
      </p>
      <p>
        If we think these rules are being broken, or there is a risk to security, we may look into
        it using the records our privacy policy describes, and we may remove content, or suspend or
        close the accounts or productions involved. Where it is serious, we may do that straight
        away, without telling you first. We&rsquo;ll usually tell you why, unless the law or
        security stops us. If you think someone is breaking these rules, write to us.
      </p>

      <h2>Plans and payment</h2>
      <p>
        Every crew account is free. Plans are per production: the free plan, and paid plans as shown
        on our{' '}
        <a className="sells" href="/pricing/">
          pricing page
        </a>
        <span className="app-only">pricing page</span> when you buy, plus VAT where it applies.
      </p>
      <p>
        Starter and Pro are billed monthly in advance by card, and renew each month until they are
        cancelled. You can cancel at any time, and the plan ends at the close of the month
        you&rsquo;ve paid for; we don&rsquo;t refund part months unless the law requires it. You
        cancel a plan from your account on our website, or by writing to us. Deleting the app or
        signing out doesn&rsquo;t cancel it. We&rsquo;ll tell you in advance of a price change, so
        you can cancel before it applies. If a payment fails and isn&rsquo;t put right after
        we&rsquo;ve told you, we may move the production to the free plan.
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
        We own StageRoll, including its name, logo and design, apart from your content. While these terms apply, you may use it for your
        productions; that right is yours alone and can&rsquo;t be transferred. If you send us ideas
        or feedback, we may use them freely.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep StageRoll available and your data safe, but we can&rsquo;t promise it will
        always be available or free of errors, and it is provided as it is. We may change or remove
        features. If we ever close StageRoll altogether, we&rsquo;ll give account holders as much
        notice as we reasonably can.
      </p>
      <p>
        Counts, totals, values and reports in StageRoll are there to help, and can be wrong or out
        of date. Check them before you rely on them, above all for money, insurance or safety.
      </p>
      <p>
        We can&rsquo;t promise to bring back work that is lost or deleted, beyond what Recently
        deleted holds. Keep your own copy of anything you can&rsquo;t afford to lose.
      </p>
      <p>
        We aren&rsquo;t responsible for a failure or delay caused by something outside our
        reasonable control, such as your device or connection, a lost sign-in, or another
        company&rsquo;s service going wrong.
      </p>

      <h2>Other companies&rsquo; sites and services</h2>
      <p>
        Links, pictures and services that come from other companies aren&rsquo;t ours: a website a
        research link points to, a supplier, or the service you sign in with. Their own terms and
        privacy policies apply, and we aren&rsquo;t responsible for them.
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
      <p>
        If you use StageRoll for a business, a company or a production, it will cover our reasonable
        costs and losses if a claim is made against us because of what its team put into StageRoll,
        or because its team broke these terms. This doesn&rsquo;t apply to someone using StageRoll
        as an individual consumer.
      </p>

      <h2>Ending things</h2>
      <p>
        You can delete your account in the app at any time, or ask us to do it for you. Deletion
        takes effect straight away and can&rsquo;t be undone; our privacy policy says what goes and
        what stays. If you own a production that other people are on, or one on a paid plan, the
        app asks you to settle that first, so no team is left without an owner.
      </p>
      <p>
        We may suspend or close an account or a production that breaks these terms, as acceptable
        use describes. The parts of these terms that are meant to last, such as our liability, carry
        on after an account closes.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may change these terms at any time. If a change matters, we&rsquo;ll tell account holders
        before it takes effect, by email or in the app. If you don&rsquo;t accept a change, you can
        stop using StageRoll and close your account before it applies. If you keep using StageRoll
        after that, the new terms apply. The date at the top shows when they last changed.
      </p>

      <h2>General</h2>
      <p>
        These terms, our pricing page when you buy, and any contract we have both signed are the
        whole agreement between us. What our website, a demo or a conversation says isn&rsquo;t a
        promise unless it is written into one of those, and a customer&rsquo;s own purchase terms
        don&rsquo;t apply unless we agree to them in writing.
      </p>
      <p>
        We can tell you things under these terms by email to your account&rsquo;s address, or in the
        app, so keep that address up to date.
      </p>
      <p>
        If part of these terms can&rsquo;t be enforced, the rest still applies. If we don&rsquo;t
        act on a right straight away, we haven&rsquo;t given it up. We may transfer these terms to a
        business that takes over StageRoll, and we&rsquo;ll tell you if we do. No one else has
        rights under them.
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
