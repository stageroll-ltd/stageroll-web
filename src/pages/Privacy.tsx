import { company } from '../Layout'

export function Privacy() {
  return (
    <article className="prose">
      <h1>Privacy policy</h1>
      <p className="updated">Last updated 21 September 2026</p>

      <p className="lede">
        This policy covers the StageRoll app, on iPhone, Android and the web, and this website. It
        says what we collect, why, where it is kept, and what you can ask us to do with it.
      </p>

      <h2>Who we are</h2>
      <p>
        {company.name}, company number {company.number}, registered office{' '}
        {company.address.join(', ')}. We are the data controller for the personal data described
        here. Write to <a href={`mailto:${company.email}`}>{company.email}</a> with any question.
      </p>

      <h2>This website</h2>
      <p>
        This site sets no cookies, runs no analytics and collects no personal data. It is a static
        site served by GitHub Pages, whose servers may keep standard access logs, such as your IP
        address and the pages requested, for their own operation and security. If you email us, we
        keep the correspondence for as long as we need it to deal with your enquiry.
      </p>

      <h2>What we collect in the app</h2>
      <p>
        <strong>Your account.</strong> Your email address, the name you give us and the department
        you work in. Sign-in is an email and a one-time code, so we hold no password for you.
      </p>
      <p>
        <strong>Your production's content.</strong> Everything a production's team puts in so the
        service can work: scripts and the scenes and characters read from them, the schedule and
        its notes, changes, items and crates with their photographs and notes, research pictures,
        links and notes, and the reports you run.
      </p>
      <p>
        <strong>On your device.</strong> The app asks for camera and photo library access to take
        and add photographs. Your PIN and Face ID are checked by your phone and never leave it.
        Script reading runs on your device; the script file itself is not sent to us for analysis.
        We do not collect your location.
      </p>

      <h2>How we use it</h2>
      <p>
        To run the service: signing you in, showing each production to its members, and keeping the
        records your team creates. To send you sign-in codes and messages about your account. To
        answer when you write to us. Nothing else.
      </p>

      <h2>What we don't do</h2>
      <p>
        We do not sell your data, show advertising, or share your information with third parties for
        their own purposes. There is no advertising or analytics tracking in the app. We do not use
        your content to train AI models.
      </p>


      <h2>Where it lives</h2>
      <p>
        Data is stored with Supabase, our database, authentication and file storage provider, with
        access controlled per production member. Sign-in codes are delivered through our email
        provider, Resend. These providers process data only to run the service for us.
      </p>

      <h2>Who can see production content</h2>
      <p>
        A production's content is visible only to that production's members. Removing someone from a
        production removes their access. We look at customer content only to keep the service working
        or when you ask us to.
      </p>

      <h2>Keeping and deleting</h2>
      <p>
        We keep your account and content for as long as your account exists. You can change your
        name and department in the app. You can delete your account from the app or by writing to
        us. Deletion is scheduled with a 14-day grace period, in which you can change your mind,
        after which your account and personal data are removed. Content you added to a production stays with that production, without your name,
        so the rest of the team's records are not broken.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK data protection law you can ask us for a copy of the personal data we hold about
        you, ask us to correct or delete it, or object to how we use it. Write to{' '}
        <a href={`mailto:${company.email}`}>{company.email}</a> and we will answer within a month. If
        you are not happy with our answer you can complain to the Information Commissioner's Office
        at <a href="https://ico.org.uk/">ico.org.uk</a>.
      </p>

      <h2>Children</h2>
      <p>StageRoll is a tool for working productions and is not directed at children under 16.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy in a way that matters, we will tell you in the app or by email
        before it takes effect. The date at the top says when it last changed.
      </p>
    </article>
  )
}
