// The feature pages under /product/, one per area of the overview: what each
// area is, how it works and its key features. Content first: no screenshots
// for now. Every line is something the app does, checked against
// stageroll-native, worded by what it does for a department, not how its
// screen is laid out. Each page's slug is its group's id on the overview.

import type { IconName } from '../components/Icon'

export type FeaturePage = {
  slug: string
  title: string
  /** Its card on the product overview: an icon and one line. */
  icon: IconName
  summary: string
  /** The page's meta description. */
  description: string
  lede: string
  steps: [lead: string, text: string][]
  features: [lead: string, text: string, icon: IconName][]
  /** A further page to read, linked above the way back to the overview. */
  more?: { href: string; label: string }
}

export const featurePages: FeaturePage[] = [
  {
    slug: 'script',
    title: 'Script analysis',
    icon: 'doc',
    summary: 'Your script, read into scenes and cast in seconds.',
    description:
      'How StageRoll reads a script: PDF and Final Draft, read on your device, the scenes and cast it finds, your review, and how new drafts land.',
    lede: 'StageRoll reads your script and builds the production’s scene list and cast from it. Every department then breaks down against the same scenes and characters.',
    steps: [
      [
        'Import the script',
        'A PDF with selectable text, or a Final Draft (.fdx) file. It’s read on your device, and the file is never uploaded.',
      ],
      [
        'StageRoll reads it',
        'Every scene in order, with its number as printed, interior or exterior, location and time of day. Every speaking character, and how often they speak. Crowds and extras, with a head count where the script gives one.',
      ],
      [
        'You review it',
        'Principals are numbered by how much they speak, like a cast list. Names that look misread, or appear with and without a title, are offered as merges. Rename, retype, merge or remove any character, and fix or drop any scene.',
      ],
      [
        'It joins the production',
        'Nothing is added until you approve. Then the scenes become the production’s scene list and the characters its cast, for every department to break down.',
      ],
      [
        'New drafts',
        'Import the next draft and every scene and character is matched to what’s already there, so the work stays attached. You see what’s new, what changed and what didn’t, and you’re only asked about real decisions, like a renamed scene or a cut scene that has work on it.',
      ],
    ],
    features: [
      ['Read on your device', 'The script file never leaves your phone. Only the scene list and the cast are kept, never the dialogue or action.', 'phone'],
      ['Cast numbers that hold', 'A character keeps their number through every draft, and a coordinator can change it to match the call sheet.', 'hash'],
      ['Background with head counts', 'Crowds join as background, with how many are needed in each scene.', 'users'],
      ['Merge suggestions', 'Likely misreads and duplicate names are flagged before anything joins.', 'merge'],
      ['Auto clean-up', 'Untidy sluglines get a suggested fix for their time of day, so the scene list reads cleanly. Accept or decline each one.', 'sparkle'],
      ['Draft history', 'Every draft is kept on record with its scene and character counts, named the way the production names them.', 'history'],
      ['Series and episodes', 'Each episode has its own drafts and its own scene numbers.', 'layers'],
      ['Scenes before the script', 'Add scenes by hand. When the script arrives, StageRoll asks which ones match, so nothing is doubled.', 'plus'],
    ],
  },
  {
    slug: 'scenes',
    title: 'Scenes',
    icon: 'clapper',
    summary: 'A page for every scene, through your department.',
    description:
      'How scenes work in StageRoll: a page for every scene through your department, the cast in it, its status, the running order and search.',
    lede: 'Every scene gets its own page, seen through your department, and the scene list keeps the production’s running order.',
    steps: [
      [
        'Scenes come from the script',
        'Each scene joins with its number, interior or exterior, location, time of day and the characters in it. You can add scenes by hand too.',
      ],
      [
        'Open a scene',
        'You see your department’s photos and note for it, then everyone in the scene with what they wear or carry there. Principals and background are kept apart, with the head count the scene needs.',
      ],
      ['Break it down', 'Add a costume change, style or look to a character, or place a prop, straight from the scene.'],
      ['Track it', 'Mark where the scene stands, from to do to done. Everyone on the production sees the same status.'],
    ],
    features: [
      ['Your department’s view', 'Photos, notes and the breakdown for the department you work in. Switch department at any time.', 'eye'],
      ['Cast in the scene', 'Every character in it with their change, style, look or props, and background with head counts.', 'users'],
      ['Scene details', 'Number, setting, location, time, a short summary, the days it shoots and who’s in it, all editable.', 'list'],
      ['Running order', 'Drag scenes into order and renumber them in bulk. Clashing numbers are blocked, and a retired number is never reused.', 'order'],
      ['Omitted scenes', 'An omitted scene keeps its number, and the list can show or hide them.', 'eyeoff'],
      ['Find a scene', 'Search the list by number, place, interior or exterior, time or shoot day.', 'filter'],
      ['One search', 'Scenes, characters, items, crates and records, by name, number or code.', 'search'],
      ['Readable with no signal', 'Scenes you’ve opened stay readable offline. Enhanced offline mode is coming soon.', 'wifi'],
    ],
  },
  {
    slug: 'continuity',
    title: 'Continuity',
    icon: 'camera',
    summary: 'Every change, style, look and prop, on record against the script.',
    description:
      'How continuity works in StageRoll: costume changes, hair styles and makeup looks, the kit in each, props by scene, character pages and the continuity book.',
    lede: 'Each department keeps its continuity against the script: costume changes, hair styles, makeup looks and props, each tied to the scenes and characters it belongs to.',
    steps: [
      ['Start from a scene', 'Add a change, style or look to a character in the scene, numbered for that character.'],
      ['Build the kit', 'Add the items a change is made of, or the pieces in a style or look, from the inventory.'],
      ['Photograph it', 'Photos go on the change, style or look, or on your department’s photos of the scene.'],
      ['Note it', 'Each change, style and look has a note that travels with it, and each department keeps its own note on every scene.'],
      ['Wrap it', 'Mark it done when you’ve finished with it, and it reads as done everywhere it’s listed.'],
    ],
    features: [
      ['Costume changes', 'Numbered per character, each with its photos, note, items and scenes.', 'shirt'],
      ['Styles and looks', 'Hair and makeup keep theirs the same way, in their own words and numbering.', 'scissors'],
      ['The kit', 'The items in each change, and the wigs, hairpieces, appliances and other pieces in each style or look. Anything damaged, lost or needing repair is flagged.', 'box'],
      ['Props by scene', 'What each character carries in a scene, and the set props, each one an inventory item with a note for that scene.', 'clapper'],
      ['Props breakdown', 'Every prop in every scene, grouped by character or by scene.', 'list'],
      ['Department lists', 'Every change, style or look in one list, by scene or by character, and searchable.', 'layers'],
      ['Character pages', 'Every photo of the character, a description, their records, scenes and personal props.', 'user'],
      ['The continuity book', 'Every photo in the production in script order, opening on your department’s, with who added each one and when.', 'camera'],
    ],
  },
  {
    slug: 'research',
    title: 'Research',
    icon: 'pin',
    summary: 'References pinned to the script, and into the inventory.',
    description:
      'How research works in StageRoll: one wall of references, pinned to characters, scenes and sets, signed off, and turned into inventory.',
    lede: 'Gather the production’s references in one place, pin them to the script, and turn the ones you buy or make into inventory.',
    steps: [
      ['Add a reference', 'Take a photo, choose several from your library, paste a link to get its title and picture, or write a note.'],
      ['Pin it', 'Pin it to one or more characters, scenes or sets, and it shows up in their research. Anything unpinned sits under General.'],
      ['Sign it off', 'Track it from proposed to approved, and note its price and where it came from.'],
      [
        'Buy or make it',
        'Turn the reference into an inventory item, filled in with its name, price, source, character and pictures. The reference is marked bought and links to the item.',
      ],
    ],
    features: [
      ['One research wall', 'Pictures, links and notes for the whole production, as your department or as everyone.', 'grid'],
      ['Filters and sorting', 'By kind, and by character, scene or set. Sorted by date, status or price.', 'filter'],
      ['Pinned to the script', 'A reference can sit on several characters, scenes and sets at once.', 'pin'],
      ['Works offline', 'Add references with no signal. They sync to the production as soon as you’re back online.', 'wifi'],
      ['Signed off', 'See at a glance what’s been approved.', 'check'],
      ['Prices and sources', 'What it costs and where it was found, carried into the item.', 'pound'],
      ['Bulk actions', 'Pin, unpin or delete several references at once.', 'layers'],
    ],
  },
  {
    slug: 'inventory',
    title: 'Inventory',
    icon: 'box',
    summary: 'Everything the production owns, tied to every scene it’s in.',
    description:
      'How inventory works in StageRoll: folders and crates, full item records, hire and loans, character closets, where each item is used, and problems flagged.',
    lede: 'One inventory for the whole production, unified with continuity: everything it owns or hires, filed in folders, packed in crates, and part of every scene and record it’s used in.',
    steps: [
      [
        'Add an item',
        'A name is enough to start, and you can keep adding while you unpack. An item started from a scene, change or crate goes straight into it.',
      ],
      [
        'Fill in what matters',
        'Photos, sizes, costs and condition, and whether it was bought, rented, made or borrowed.',
      ],
      ['File it', 'Put it in a folder, pack it in a crate, or file it under the character who uses it.'],
      ['Use it', 'Add it to scenes, changes, styles and looks. Its page shows everywhere it’s used.'],
      ['Keep it in shape', 'Mark anything damaged, lost or needing repair, and it’s counted where the department will see it.'],
    ],
    features: [
      ['Unified with continuity', 'Changes, styles, looks and props are made from the same items, and every item shows each scene and record it’s in, and the research it came from. Nothing is entered twice.', 'link'],
      ['Folders', 'Folders within folders, browsed like files on your phone.', 'folder'],
      ['Crates', 'Labelled boxes with their own code, photos and note, listing everything packed inside.', 'box'],
      ['Codes and QR', 'Every item and crate gets a short code and QR, unique to the production.', 'qr'],
      ['Hire and loans', 'Who it came from, the paperwork, and when it goes back.', 'clock'],
      ['Character closets', 'Everything filed under a character, picture first.', 'user'],
      ['Status and flags', 'Anything damaged, lost or needing repair is flagged, so problems are easy to spot.', 'flag'],
      ['Valued', 'Unit and replacement costs feed the inventory report’s valuation.', 'pound'],
    ],
  },
  {
    slug: 'scanning',
    title: 'Codes and scanning',
    icon: 'qr',
    summary: 'A code on every item and crate. Scan it and it opens.',
    description: 'How codes and scanning work in StageRoll: a short code and QR for every item and crate, scanning to open, and scanning to invite.',
    lede: 'Every item and crate has its own code, and the phone you carry reads it.',
    steps: [
      ['Every item gets a code', 'A short code made from the production’s letters, with its QR, as soon as the item or crate is added.'],
      ['Scan it', 'Point the phone at the code and the item or crate opens, even in the dark with the torch.'],
      [
        'Invite by code',
        'Everyone has a personal code. Scan it to invite that person to the production, with their role. They still accept the invite themselves.',
      ],
    ],
    features: [
      ['Production codes', 'Codes start with the production’s letters, so they’re easy to tell apart.', 'hash'],
      ['Codes on screen', 'Open any code full screen to scan it straight off a phone.', 'phone'],
      ['A torch built in', 'For the back of a dark truck.', 'torch'],
      ['Only your production', 'A code from another production won’t open, and you’re told why.', 'shield'],
      ['Personal codes', 'Invite the right person, with no typing and no wrong address.', 'userplus'],
    ],
  },
  {
    slug: 'schedule',
    title: 'Schedule',
    icon: 'calendar',
    summary: 'The shoot on one calendar, and today on the first screen.',
    description:
      'How the schedule works in StageRoll: today’s scenes, the shoot calendar, kinds of day, shoot-day numbering, day sheets in shoot order and notes.',
    lede: 'The whole shoot on one calendar, every day on its own sheet, and today’s scenes the moment you open the app.',
    steps: [
      [
        'Lay out the shoot',
        'Set what each day is, from shoot days to prep, travel and days off. Lay out the whole shoot in one go, fix the exceptions, and the crew only sees it once you save.',
      ],
      ['Book the scenes', 'Put scenes on their days and drag them into shoot order. A scene can shoot on more than one day.'],
      ['Run the day', 'Each day has a sheet with its scenes in shoot order, where each one stands, and the notes for that day.'],
      ['Open on today', 'The app opens on today’s scenes and notes, and what you were last working on.'],
    ],
    features: [
      ['Counted like a call sheet', 'Only shoot days take a number, so each day reads as its place in the shoot.', 'hash'],
      ['Calendar', 'A month view with every scene on its day, and the first and last days marked.', 'calendar'],
      ['Day notes', 'For yourself, your department or the whole production. Private notes stay private, coordinators included.', 'doc'],
      ['Who can change it', 'The owner and coordinators lay out days and book scenes. Crew can read all of it.', 'lock'],
      ['Readable with no signal', 'Today, the calendar and the day sheets stay readable offline. Enhanced offline mode is coming soon.', 'wifi'],
    ],
  },
  {
    slug: 'reports',
    title: 'Reports',
    icon: 'share',
    summary: 'Each department’s paperwork, built the moment you ask.',
    description:
      'How reports work in StageRoll: each department’s reports, the characters and scenes they cover, PDF and spreadsheet, and a record of what was made.',
    lede: 'Each department has its own reports, built from the production as it stands the moment you ask.',
    steps: [
      ['Pick a report', 'Each department has its own set, ready-made.'],
      [
        'Choose what it covers',
        'The characters and scenes you choose, by shoot day or episode.',
      ],
      ['Send it', 'Share it straight from your phone, or download it in a browser. StageRoll keeps no copy.'],
    ],
    features: [
      ['Costume', 'Costume plot, changes by character, continuity book, bag tags, fitting notes, inventory and wrap boxes.', 'shirt'],
      ['Props', 'Props by scene, props status, inventory and wrap boxes.', 'clapper'],
      ['Hair and makeup', 'Style and look plots, by character, continuity books and actor notes.', 'scissors'],
      ['Spreadsheets', 'Plots, props lists and inventories also export as CSV.', 'table'],
      ['Always current', 'Every report is built when you ask, from the production as it is.', 'refresh'],
      ['A record', 'Which reports were made, by whom and when.', 'history'],
    ],
  },
  {
    slug: 'team',
    title: 'Team',
    icon: 'users',
    summary: 'Owner, coordinators and crew, each in their own department.',
    description:
      'How teams work in StageRoll: owner, coordinator and crew, inviting by code or email, departments, and one account across productions.',
    lede: 'Everyone works in the same production, each through their own department, with three roles that set who can do what.',
    steps: [
      ['Set up the production', 'Whoever creates it is its owner.'],
      [
        'Invite the team',
        'Scan someone’s personal code, or enter the email they use for StageRoll, and choose coordinator or crew. They accept the invite in the app.',
      ],
      [
        'Work in your department',
        'Each person works through their own department, and everything opens on that department’s work. Switch at any time.',
      ],
    ],
    features: [
      ['Owner', 'Changes the plan, edits the production, changes roles, removes people and deletes the production.', 'crown'],
      ['Coordinators', 'Invite people, lay out the schedule, write notes for everyone and manage episodes.', 'users'],
      ['Crew', 'Do the department’s work, and read the schedule and the team.', 'user'],
      ['The team list', 'Everyone by role, with the invites still waiting.', 'list'],
      ['One account, every job', 'Free for crew. Belong to several productions, switch between them, and take your account to the next job.', 'layers'],
      ['On every device', 'iPhone, iPad and Android, with your department following you between them.', 'phone'],
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy and security',
    icon: 'lock',
    summary: 'Scripts stay on your device. Work stays with your team.',
    description:
      'How StageRoll keeps a production private: scripts read on your device, sign-in with no password, an app lock, signed-in devices, an encrypted offline copy and members-only access.',
    lede: 'Productions hold unreleased scripts and private work, so StageRoll keeps what it can on your device and shows the rest only to the people on the production.',
    steps: [
      ['Lock the app', 'StageRoll locks when you leave it and opens with your PIN or Face ID. You choose how quickly it locks.'],
      ['Work in your production', 'In the app, a production’s scenes, records and photos are shown only to its members, and photos are stored privately.'],
      ['Sign out anywhere', 'See every device signed in to your account and sign any of them out. A device left unused for 90 days is signed out on its own.'],
    ],
    features: [
      ['Scripts stay on your device', 'The script is read on your phone and the file is never uploaded. Only the scene list and the cast are kept.', 'doc'],
      ['Sign in with a code', 'A one-time code sent to your email, so there’s no password to remember.', 'key'],
      ['App lock', 'PIN or Face ID, and it locks itself when you step away.', 'shield'],
      ['Signed-in devices', 'Every device on your account, and any of them can be signed out.', 'phone'],
      ['Encrypted offline copy', 'The copy of your production kept for offline use is encrypted on your phone, and cleared when you sign out.', 'lock'],
      ['Members only', 'In the app, a production is shown only to the people on it.', 'users'],
      ['Private photos', 'Photos are stored privately, and their location and camera details are removed before they’re uploaded.', 'camera'],
      ['No ads, no selling', 'Your work is never sold, used for advertising or used to train AI.', 'eyeoff'],
    ],
    more: { href: '/privacy/', label: 'Read the privacy policy' },
  },
]
