import { company } from '../Layout'

// The policy for StageRoll as it will be at launch, not as the app is today:
// the app doesn't launch until it is good (decision, 12 October 2026). Much
// of this isn't built yet, so it must be audited against stageroll-native
// before launch, sentence by sentence. stageroll-docs #40 lists what has to be
// true first.

export function Privacy() {
  return (
    <article className="prose">
      <h1>Privacy policy</h1>
      <p className="updated">Last updated 12 October 2026</p>

      <p className="lede">
        This policy covers the StageRoll app for iPhone, iPad and Android, and this website,
        stageroll.co. It says what we collect, why, who else handles it, how we protect it, how long
        we keep it, and what you can ask us to do.
      </p>

      <h2>Who we are</h2>
      <p>
        {company.name}, company number {company.number}, registered office{' '}
        {company.address.join(', ')}. We are the controller of your account details, the records we
        keep to run, secure and improve StageRoll, billing records, this website, and emails you send
        us. Write to <a href={`mailto:${company.email}`}>{company.email}</a> with any question.
      </p>

      <h2>Content a production puts in</h2>
      <p>
        A production&rsquo;s team uses StageRoll to record its work, and that can include
        information about people who don&rsquo;t use StageRoll: photos of cast in costume, hair and
        makeup, sizes and notes recorded against the characters they play, and the names of people
        items are lent to. The company or person running the production decides what is recorded
        and why, and is the controller of that content. The same goes for the access log on a
        production with enhanced security: the production chooses to keep a record of who opened
        what, and it is the production&rsquo;s record. We store and handle all of it on the
        production&rsquo;s behalf, to provide StageRoll. If
        you have a question about what a production holds about you, ask the production, or write to
        us and we&rsquo;ll pass it on.
      </p>

      <h2>This website</h2>
      <p>
        This site sets no cookies and runs no analytics, and we collect no personal data through it.
        It is hosted on GitHub Pages, and GitHub records visitors&rsquo; IP addresses for security,
        under its own privacy statement. If you email us, your message is handled by our email
        provider, Microsoft 365.
      </p>

      <h2>What we collect in the app</h2>
      <p>
        <strong>Your account.</strong> Your email address, your name, your department, and a
        profile photo if you add one. You sign in with a one-time code sent to your email, or with
        Apple or Google, and never set a StageRoll password. If you sign in with Apple or Google,
        they share your name and email address with us; Apple may give us a private relay address
        instead of your own. If your production signs in through its organisation&rsquo;s own
        sign-in service, we receive your name and email address from it. You need to give your
        email address, name and department to use StageRoll; the photo is optional.
      </p>
      <p>
        <strong>Your productions.</strong> The productions you belong to, your role in each, the
        invitations you send and receive, and which records and reports you added, and when.
      </p>
      <p>
        <strong>Your devices.</strong> For each device you sign in on: its model, its platform, the
        IP address and app version it connects with, and when it signed in and was last active. You
        can see your devices in the app and sign any of them out.
      </p>
      <p>
        <strong>What your team puts in.</strong> Scenes and characters; the schedule and its notes;
        changes, styles, looks and props; items and crates with their photos, notes, sizes, costs
        and supplier details; and research pictures, links and notes. From a script we keep its
        name, its file name, the scene headings and the characters, never its dialogue or action.
        From a report we keep a record of which report was made, by whom and when; the report itself
        is made on your device, and we don&rsquo;t keep a copy.
      </p>
      <p>
        <strong>On productions with enhanced security.</strong> An access log of who opened or
        exported scripts, reports and photos, and when. On iPhone, a screenshot of a protected screen
        is noted in the log. Reports exported from the production carry the name and email address
        of the person who exported them, so a leaked copy can be traced.
      </p>
      <p>
        <strong>Diagnostics and usage.</strong> When something goes wrong, the app sends us an error
        report: what failed, the app version, the device model and your account, so we can fix it.
        We also collect information about how the app is used, such as which screens are opened and
        which features are used, so we can make StageRoll better. We don&rsquo;t put the content of
        your productions in either. You can turn usage information off in the app&rsquo;s settings.
      </p>
      <p>
        <strong>Billing.</strong> For a production on a paid plan, the person paying gives us
        billing details: their name, billing email address, postal address, and VAT number if they
        have one. Card payments are taken by our payment provider, and we never see or store full
        card numbers.
      </p>

      <h2>On your device</h2>
      <p>
        The app asks for camera access to take photos and scan StageRoll codes, and adds photos from
        your library only when you choose them. Photos are resized on your device before they are
        uploaded, and their location and camera details are removed. We don&rsquo;t collect your
        device&rsquo;s location. Scripts are read on your device, and the script file is never
        uploaded.
      </p>
      <p>
        Your PIN is stored and checked only on your device, and Face ID is handled by your phone;
        neither is sent to us. Your sign-in and an offline copy of your productions, including photos
        you&rsquo;ve viewed, are kept encrypted on your device. All of it is cleared when you sign
        out, and a production&rsquo;s copy is removed when you leave it or are removed from it.
      </p>
      <p>
        When you add a research link, StageRoll fetches its title and picture once, through our
        servers, and keeps the picture with the production. The linked website sees a request from
        us, not from you or your team.
      </p>

      <h2>How we use it, and why</h2>
      <p>
        <strong>To provide StageRoll</strong>, under our terms with you: creating your account,
        signing you in, showing each production to its members, keeping the records your team
        creates, sending the emails the service needs, such as sign-in codes, and taking payment for
        paid plans.
      </p>
      <p>
        <strong>To keep StageRoll secure and working</strong>, because we have a legitimate interest
        in protecting the service and your account: listing your signed-in devices, signing out
        devices left unused for 90 days, and using error reports to find and fix problems and look
        into misuse.
      </p>
      <p>
        <strong>To improve StageRoll</strong>, because we have a legitimate interest in making it
        better: using information about how the app is used, which you can turn off.
      </p>
      <p>
        <strong>To keep the access log</strong>, on behalf of productions that use enhanced security.
      </p>
      <p>
        <strong>To meet our legal obligations</strong>, such as keeping tax records and answering
        lawful requests.
      </p>
      <p>We don&rsquo;t sell your data or show advertising, and we don&rsquo;t use your work to train AI.</p>

      <h2>Who else sees it</h2>
      <p>
        The other members of your productions see your name, email address, photo and role, and
        which records and reports you added. On productions with enhanced security, the
        production&rsquo;s owner and coordinators also see the access log. People running a
        production can find your account by your email address to invite you.
      </p>
      <p>
        Our providers handle data on our instructions, to run StageRoll: Supabase, for our database,
        sign-in and file storage, running on Amazon Web Services with traffic passing through
        Cloudflare; our email delivery provider, for sign-in codes; our payment provider, for card
        payments; our diagnostics and analytics providers, for error reports and usage information;
        and Microsoft, for our own email. Businesses can ask us for our data processing agreement
        and the full list of our providers.
      </p>
      <p>
        We also share information when the law requires it, and with a buyer if the business is ever
        sold, who would have to keep to this policy.
      </p>

      <h2>Where it&rsquo;s stored</h2>
      <p>
        Your productions are stored in the UK. Some of our providers, such as those for diagnostics
        and email, may store data in the European Economic Area, which UK law treats as protecting it
        adequately. Some are based in, or have staff in, other countries, including the United
        States, and may reach data from there. Where they do, we rely on the UK&rsquo;s adequacy
        regulations, including the UK&ndash;US data bridge, or on the UK&rsquo;s International Data
        Transfer Agreement or Addendum.
      </p>

      <h2>How we protect it</h2>
      <p>
        Data is encrypted when it travels and when it&rsquo;s stored. A production&rsquo;s content
        is available only to its members, and photos are served through links that expire within a
        day. Our own access to customer content is limited to keeping the service working,
        investigating a breach of our terms, helping when you ask us to, and what the law requires.
      </p>
      <p>
        No system is perfectly secure. If a breach puts your data at risk, we&rsquo;ll tell the
        Information Commissioner&rsquo;s Office within 72 hours and the productions affected without
        delay, and we&rsquo;ll tell you directly if the risk to you is high.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Your account details: until you delete your account.</li>
        <li>
          A production&rsquo;s content: while the production exists. A deleted production stays in
          Recently deleted for 30 days, and is then erased with its photos.
        </li>
        <li>
          The report record, the access log and what&rsquo;s kept from scripts: with the production
          they belong to, and deleted with it.
        </li>
        <li>Invitations: 30 days after they are answered or expire.</li>
        <li>A device&rsquo;s record: until it signs out, or 90 days after it was last used.</li>
        <li>Error reports and usage information: up to 12 months.</li>
        <li>Billing records: six years, as UK tax law requires.</li>
        <li>
          Emails you send us: two years after our last exchange, or longer if they relate to a
          contract, a complaint or a legal claim.
        </li>
        <li>Copies in our backups and logs: deleted within 30 days.</li>
      </ul>

      <h2>Deleting your account</h2>
      <p>
        You can delete your account in the app&rsquo;s settings, or ask us to do it for you. It
        takes effect straight away and can&rsquo;t be undone. Your account, your profile photo and
        your personal notes are deleted, along with any production only you belong to and anything in
        your Recently deleted. If you own a production that other people are on, hand it over to one
        of them first, so no team is left without an owner. Work you added to other people&rsquo;s
        productions stays with them, without your name.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK data protection law you can ask us for a copy of your personal data, ask us to
        correct or delete it, ask us to limit how we use it, or ask for the data you gave us in a
        format you can reuse. You can download a copy of your account data from the app&rsquo;s
        settings at any time. For information a production holds about you, we&rsquo;ll pass your
        request to the production.
      </p>
      <p>
        <strong>You can object</strong> to us using your data where we rely on our legitimate
        interests, and we&rsquo;ll stop unless we have compelling grounds to continue.
      </p>
      <p>
        Write to <a href={`mailto:${company.email}`}>{company.email}</a>. We may ask you to confirm
        who you are. We&rsquo;ll reply within one month, or tell you within that month if a complex
        request needs up to two more.
      </p>
      <p>
        If you&rsquo;re unhappy with how we&rsquo;ve handled your data, tell us and we&rsquo;ll look
        into it. You can also complain to the Information Commissioner&rsquo;s Office at{' '}
        <a href="https://ico.org.uk/">ico.org.uk</a>.
      </p>

      <h2>Children</h2>
      <p>
        StageRoll is a tool for people working on productions and isn&rsquo;t meant for children.
        You must be 16 or over to create an account.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy in a way that matters, we&rsquo;ll email account holders before the
        change takes effect. The date at the top shows when it last changed.
      </p>
    </article>
  )
}
