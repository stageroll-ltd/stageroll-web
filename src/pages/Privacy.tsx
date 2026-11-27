import { company } from '../Layout'

// WRITTEN WITH ROOM IN IT (owner's call, 27 November 2026). The policy says
// what we MAY collect and the KINDS of provider we use, and makes few hard
// promises, so the app can change without making a sentence here false.
// When editing:
//
//   - Broad is fine; false is not. "May" covers something not built yet.
//     Never say the app does NOT do a thing unless that is certain and
//     will stay so.
//   - No provider is named and no mechanism is described. The law asks for
//     the kinds of recipient, as specific as we can be about what each
//     does. The list of names, "available on request", is kept on
//     stageroll-docs #40.
//   - Periods say "around" or "usually", unless the law fixes them.
//   - A few promises are kept ON PURPOSE, because they are what the product
//     sells: the script file is never uploaded, productions are stored in
//     the UK, the PIN stays on the device, no selling, no advertising.
//     Prove each against the app before every release (stageroll-docs #41).
//   - NOT promised any more (owner, 27 November 2026): what is or is not
//     kept from a script beyond "the file is never uploaded". Do not write
//     "never the dialogue or action" here or anywhere on the site.
//   - AI (owner, 27 November 2026). AI tools ARE used to check things on
//     production ("I want to cover myself now"), and what covers that is
//     ONE sentence under "How we use it": "We may use tools from our
//     providers, including AI tools, to help us run, check, support and
//     fix StageRoll", with the provider named on the list (#40). Keep it,
//     and keep it that short: it does not say what the tools read ("Why do
//     you need to say that?"). There is NO promise about AI anywhere, on
//     purpose ("it's not a selling point, and we're only drawing attention
//     to it. Let's just leave it off"). Never add one, here or on the
//     site: not "never used to train AI", not "we don't train AI of our
//     own".
//
// It replaces the 12 October 2026 text, which described the launch app in
// detail and was untrue of the app in thirteen places (the check is a
// comment on #40). A solicitor still reads this before launch (#40).

export function Privacy() {
  return (
    <article className="prose">
      <h1>Privacy policy</h1>
      <p className="updated">Last updated 27 November 2026</p>

      <p className="lede">
        This policy covers the StageRoll app and this website, stageroll.co. It says what we collect,
        why, who else handles it, how we protect it, how long we keep it, and what you can ask us to
        do. We may change it at any time; the date above shows when it last changed.
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
        items come from or go to. The company or person running the production decides what is recorded
        and why, and is the controller of that content. The same goes for any record a production chooses to
        keep of who opened what, where its plan offers one: it is the production&rsquo;s record. We store and handle all of it on the
        production&rsquo;s behalf, to provide StageRoll. If
        you have a question about what a production holds about you, ask the production, or write to
        us and we&rsquo;ll pass it on.
      </p>

      <h2>This website</h2>
      <p>
        You can read this site without giving us any personal data. Our hosting provider records
        visitors&rsquo; IP addresses for security, under its own privacy statement. Where the site
        lets you sign in or manage a plan, what you give us there is handled as this policy
        describes for the app. If you email us, your message is handled by our email provider.
      </p>

      <h2>What we collect in the app</h2>
      <p>
        <strong>Your account.</strong> Your email address, your name, your department, and a
        profile photo if you add one. You sign in with a one-time code sent to your email and a
        password you choose, or through another sign-in service the app offers, such as Apple or
        Google. We keep your password only in a scrambled form that can&rsquo;t be turned back into
        it, and may check a new password against lists of leaked ones without sharing the password
        itself. If you sign in through another service, it shares your name and email address with
        us; Apple may give us a private relay address instead of your own. You need to give your
        email address, name and department to use StageRoll; the photo is optional.
      </p>
      <p>
        <strong>Your productions.</strong> The productions you belong to, your role in each, the
        invitations you send and receive, and which records and reports you added, and when.
      </p>
      <p>
        <strong>Your devices.</strong> For each device you sign in on: its model, its platform, the
        IP address and app version it connects with, and when it signed in and was last active. You
        can see your devices in the app and sign any of them out. If you turn on notifications, we
        also keep the address your phone gives us for sending them to that device. It is removed
        when you sign out. When you ask for a sign-in code, a security check may run on your device
        to tell people from automated abuse, and the app looks for updates when it opens; the
        providers that do these for us see your device&rsquo;s IP address and basic details such as
        the app&rsquo;s version.
      </p>
      <p>
        <strong>What your team puts in.</strong> Whatever your team records, such as scenes,
        characters and sets; the schedule and its notes; changes, styles, looks and props; items and
        crates with their photos, notes, sizes, costs and supplier details; and research pictures,
        links and notes. From a script we keep its name, its file name, and what the app reads from
        it, such as scenes, characters and sets.
        From a report we keep a record of which report was made, by whom and when; the report itself
        is made on your device, and we don&rsquo;t keep a copy.
      </p>
      <p>
        <strong>Extra security features.</strong> Some plans offer a production extra protection.
        Depending on what the production turns on, we may keep a record of who opened or exported
        scripts, reports and photos, and when, including screenshots of protected screens; and
        exported reports may carry the name and email address of the person who exported them, so a
        leaked copy can be traced.
      </p>
      <p>
        <strong>Diagnostics and usage.</strong> When something goes wrong, the app may send us an
        error report: what failed, the app version, the device model and your account, so we can fix
        it. We may also collect information about how the app is used, such as which screens are
        opened and which features are used, so we can make StageRoll better. Both are designed to
        leave out the content of your productions. Where usage information is collected, you can
        turn it off in the app&rsquo;s settings.
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
        neither is sent to us. Your sign-in and an offline copy of your productions are kept on your
        device, protected by the app&rsquo;s and your phone&rsquo;s own encryption. Signing out
        removes your sign-in and that offline copy. Pictures the app has already shown may stay in
        its cache for a while afterwards, and go when the app is removed.
      </p>
      <p>
        When you add a research link, StageRoll fetches the page&rsquo;s title and picture once, and
        keeps the picture with the production. That request may come from your device or from our
        servers, so the linked website may see your device&rsquo;s IP address, as it would if you
        opened the link.
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
        devices left unused for a long time, checking that requests come from people and not
        automated abuse, and using error reports to find and fix problems and look into misuse.
      </p>
      <p>
        <strong>To improve StageRoll</strong>, because we have a legitimate interest in making it
        better: using information about how the app is used, which you can turn off.
      </p>
      <p>
        <strong>To provide extra security features</strong>, on behalf of productions that use them.
      </p>
      <p>
        <strong>To meet our legal obligations</strong>, such as keeping tax records and answering
        lawful requests.
      </p>
      <p>
        We don&rsquo;t sell your data or show advertising. We may use tools from our providers,
        including AI tools, to help us run, check, support and fix StageRoll.
      </p>

      <h2>Who else sees it</h2>
      <p>
        The other members of your productions see your name, email address, photo and role, and
        which records and reports you added. Where a production keeps a record of
        who opened what, its owner and coordinators can see it. People running a
        production can find your account by your email address to invite you.
      </p>
      <p>
        Our providers handle data on our instructions, to run StageRoll. They are companies that
        host our database, sign-in and file storage; carry traffic to and from the app and protect
        it from abuse; send our emails, such as sign-in codes and account alerts; deliver
        notifications and app updates to your phone, through Apple or Google; take card payments;
        help us find faults and understand how the app is used; provide tools that help us run,
        check and support the service; and provide our own email.
        Businesses can ask us for our data processing agreement and the current list of our
        providers.
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
        is available only to its members, and photos are served through links that expire after
        a short time. Our own access to customer content is limited to keeping the service working,
        investigating a breach of our terms, helping when you ask us to, and what the law requires.
      </p>
      <p>
        No system is perfectly secure. If a breach puts your data at risk, we&rsquo;ll tell the
        Information Commissioner&rsquo;s Office, the productions affected and you, as the law
        requires.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          Your account details: until you delete your account. If we close an account for breaking
          our terms, we keep its email address so it can&rsquo;t be used to sign up again.
        </li>
        <li>
          A production&rsquo;s content: while the production exists. A deleted production stays in
          Recently deleted for around 30 days, and is then erased with its photos.
        </li>
        <li>
          The report record, any record of who opened what, and what&rsquo;s kept from scripts: with the production
          they belong to, and deleted with it.
        </li>
        <li>Invitations: with the production they belong to, or until we clear old ones.</li>
        <li>A device&rsquo;s record: until it signs out, or around 90 days after it was last used.</li>
        <li>Error reports and usage information: up to 12 months.</li>
        <li>Billing records: for as long as UK tax law requires, usually six years.</li>
        <li>
          Emails you send us: around two years after our last exchange, or longer if they relate to a
          contract, a complaint or a legal claim.
        </li>
        <li>Copies in our backups and logs: usually deleted within 30 days.</li>
      </ul>

      <h2>Deleting your account</h2>
      <p>
        You can delete your account in the app&rsquo;s settings, or ask us to do it for you. It
        takes effect straight away and can&rsquo;t be undone. Your account, your profile photo and
        your personal notes are deleted, along with any production only you belong to and anything in
        your Recently deleted. If you own a production that other people are on, or one on
        a paid plan, the app asks you to settle that first, so no team is left without an owner. Work you added to other people&rsquo;s
        productions stays with them, without your name.
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK data protection law you can ask us for a copy of your personal data, ask us to
        correct or delete it, ask us to limit how we use it, or ask for the data you gave us in a
        format you can reuse. For information a production holds about you, we&rsquo;ll pass your
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
        We may change this policy at any time. If a change matters, we&rsquo;ll tell account holders
        before it takes effect, by email or in the app. The date at the top shows when it last
        changed.
      </p>
    </article>
  )
}
