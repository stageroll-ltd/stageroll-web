// The department pages under /departments/, one per craft: what StageRoll
// does for that department, in its own words, linking to the feature pages
// (features.ts) for the detail. They share the feature pages' shape and
// their rule: every line is something the app does, checked against
// stageroll-native (src/departments.ts, src/reports/catalog.ts, src/sets),
// worded by what it does for the department, not how a screen is laid out.

import type { FeaturePage } from './features'

/**
 * A department page told as a landing page, not a manual (Department.tsx):
 * an opening, three facts, what the department keeps, a moment on the day,
 * its paperwork and the questions people ask. Each part is its own shape so
 * the design can give each its own layout and pictures later.
 */
export type Story = {
  /** The page's one h1. */
  headline: string
  intro: { heading: string; text: string[] }
  facts: [lead: string, text: string][]
  areas: {
    heading: string
    lede: string
    items: { name: string; text: string; href: string }[]
  }
  moment: { heading: string; text: string[] }
  papers: {
    heading: string
    lede: string
    href: string
    items: [name: string, text: string][]
  }
  questions: [question: string, answer: string][]
}

export type DepartmentPage = FeaturePage & { story?: Story }

const continuity = { href: '/product/continuity/', label: 'Continuity' }
const inventory = { href: '/product/inventory/', label: 'Inventory' }
const research = { href: '/product/research/', label: 'Research' }
const reports = { href: '/product/reports/', label: 'Reports' }
const scanning = { href: '/product/scanning/', label: 'Codes and scanning' }
const script = { href: '/product/script/', label: 'Script analysis' }
const schedule = { href: '/product/schedule/', label: 'Schedule' }

export const departmentPages: DepartmentPage[] = [
  {
    slug: 'costume',
    title: 'Costume and wardrobe',
    icon: 'shirt',
    summary: 'Changes and what’s in them',
    metaTitle: 'Costume continuity and wardrobe inventory software',
    description:
      'Costume continuity and wardrobe inventory for film and TV: every change on record against the script with photos, the stock behind it, costume plots and continuity books.',
    updated: '2026-11-28',
    lede: 'StageRoll gives the costume department one place for continuity and the wardrobe: every character’s changes against the script, and every piece those changes are made of.',
    features: [
      ['Costume changes', 'Numbered per character, each with its photos, note, pieces and scenes.', 'shirt'],
      ['Character wardrobes', 'Everything filed under a character, picture first.', 'user'],
      ['Sizes, costs and condition', 'On every piece, with anything damaged, lost or needing repair flagged.', 'flag'],
      ['Hire and returns', 'Who a piece came from, the paperwork, and when it goes back.', 'clock'],
      [
        'Crates and QR codes',
        'Pack pieces into labelled crates. Every piece and crate has a code your phone scans.',
        'qr',
      ],
      [
        'Research',
        'References pinned to characters and scenes, signed off, and turned into stock when you buy.',
        'pin',
      ],
      ['The costume plot', 'Every change, character by scene.', 'grid'],
      ['The continuity book', 'Every photo of every change, in scene order or shoot order.', 'camera'],
    ],
    story: {
      headline: 'Costume continuity and the wardrobe, kept together.',
      intro: {
        heading: 'What they wore, and where it is now',
        text: [
          'A costume department answers two questions all day. What does this character wear in this scene? And where is that piece right now? StageRoll keeps both answers in one record, so the change in front of the camera and the piece on the rail are never two lists to reconcile.',
          'It starts from the script. Import a PDF or Final Draft file and the scenes and the cast are there to break down, with each character’s changes numbered and placed on the scenes they play. When the next draft lands, your work stays attached.',
        ],
      },
      facts: [
        ['Read on your device', 'StageRoll reads your script on your phone and keeps what it reads from it, such as the scene list and the cast.'],
        [
          'One production, every department',
          'Costume, props, hair, makeup and sets work against the same scenes and characters.',
        ],
        ['Free for crew', 'The production holds the plan. Everyone you invite joins free.'],
      ],
      areas: {
        heading: 'Everything the department keeps',
        lede: 'From the first reference to the last return.',
        items: [
          {
            name: 'Changes',
            text: 'Each character’s changes, numbered in order, on the scenes they play. A change carries its photos, its note and the pieces it’s made of, and reads as done everywhere once you wrap it.',
            href: '/product/continuity/',
          },
          {
            name: 'Continuity photos',
            text: 'Taken on your phone and kept on the change or the scene as you shoot. Every photo records who added it and when.',
            href: '/product/continuity/',
          },
          {
            name: 'The wardrobe',
            text: 'Every piece with its photos, sizes, costs and condition, filed under the character who wears it, in folders or in crates. Each piece shows every change and scene it’s worn in.',
            href: '/product/inventory/',
          },
          {
            name: 'Hire and returns',
            text: 'Who a piece came from, the paperwork, and the day it goes back. Anything damaged, lost or needing repair is flagged before it becomes a surprise.',
            href: '/product/inventory/',
          },
          {
            name: 'Research',
            text: 'References as photos, links and notes, pinned to characters and scenes and signed off. When you buy the piece, the reference becomes stock, with its price and source carried across.',
            href: '/product/research/',
          },
          {
            name: 'Codes and scanning',
            text: 'A QR code on every piece and crate. Point your phone at it and it opens, even at the back of a dark truck.',
            href: '/product/scanning/',
          },
        ],
      },
      moment: {
        heading: 'When someone asks what she wore in scene 42',
        text: [
          'Open the scene and it’s there: who’s in it, the change each of them wears, your photos and your note. Open the change and you have every photo of it, the pieces it’s made of and every other scene it plays.',
          'Nobody scrolls back through a camera roll. Scenes you’ve already opened stay readable when the signal drops.',
        ],
      },
      papers: {
        heading: 'The paperwork, built when you ask',
        lede: 'Reports come from the production as it stands, so they’re never a version behind.',
        href: '/product/reports/',
        items: [
          ['Costume plot', 'Every change, character by scene, across the whole script or only the days you choose.'],
          [
            'Continuity book',
            'Every photo of every change, in scene order or shoot order, with notes and a cover page if you want them.',
          ],
          [
            'Costume inventory',
            'Every piece and crate with its condition and cost, grouped by folder or by each character’s wardrobe.',
          ],
        ],
      },
      questions: [
        [
          'Where is my script read?',
          'On your device. StageRoll keeps what it reads from it, such as the scene list and the cast.',
        ],
        [
          'Can I start before the script is locked?',
          'Yes. Add scenes by hand, or import an early draft. Each new draft is matched scene by scene to what’s already there, so your changes, photos and notes stay attached.',
        ],
        [
          'Does it work for a series?',
          'Yes. Each episode has its own drafts and its own scene numbers. Several episodes in one production are part of the Pro and Enterprise plans.',
        ],
        ['Do my crew need to pay?', 'No. Plans are per production, and everyone invited to it joins free.'],
        [
          'What does it run on?',
          'StageRoll is built for iPhone, iPad and Android, and your department follows you between them.',
        ],
        [
          'Does it work without signal?',
          'Scenes you’ve opened stay readable offline, and research can be added with no signal. Enhanced offline mode is coming soon.',
        ],
      ],
    },
    related: [continuity, inventory, research, reports, scanning],
    plan: true,
  },
  {
    slug: 'hair',
    title: 'Hair',
    icon: 'scissors',
    summary: 'Styles and their pieces',
    metaTitle: 'Hair continuity software for film and TV',
    description:
      'Hair continuity for film and TV: every style on record against the script with photos and notes, the wigs, hairpieces in each, the hair plot and the continuity book.',
    updated: '2026-11-28',
    lede: 'StageRoll is the hair department’s record of every style, every photo and every wig and hairpiece, tied to the script it’s shot from.',
    features: [
      ['Styles', 'Numbered per character, each with its photos, note, pieces and scenes.', 'scissors'],
      ['Your own department', 'Hair has its own photos, notes, lists and reports, apart from makeup’s.', 'layers'],
      ['The pieces', 'Wigs and hairpieces are inventory items, with photos, costs and condition.', 'box'],
      [
        'Status and flags',
        'Anything damaged, lost or needing repair is flagged, so problems are easy to spot.',
        'flag',
      ],
      ['Research', 'References pinned to characters and scenes, and signed off.', 'pin'],
      ['The hair plot', 'Every style, character by scene.', 'grid'],
      ['The continuity book', 'Every photo of every style, in scene order or shoot order.', 'camera'],
      ['The hair inventory', 'Every item and crate, with condition and cost.', 'table'],
    ],
    story: {
      headline: 'Hair continuity, style by style.',
      intro: {
        heading: 'Every style, on the scene it plays',
        text: [
          'Scenes are shot out of order, and a style has to match itself weeks apart. StageRoll keeps each character’s styles against the script, numbered for that character, so the reference is on the scene you’re about to shoot.',
          'It starts from the script. Import a PDF or Final Draft file and the scenes and the cast are there to break down. When the next draft lands, your work stays attached.',
        ],
      },
      facts: [
        ['Read on your device', 'StageRoll reads your script on your phone and keeps what it reads from it, such as the scene list and the cast.'],
        ['A department of its own', 'Hair has its own records, photos, notes and reports, apart from makeup’s.'],
        ['Free for crew', 'The production holds the plan. Everyone you invite joins free.'],
      ],
      areas: {
        heading: 'Everything the department keeps',
        lede: 'From the first reference to the last shooting day.',
        items: [
          {
            name: 'Styles',
            text: 'Each character’s styles, numbered in order, on the scenes they play. A style carries its photos, its note and the pieces in it, and reads as done everywhere once you wrap it.',
            href: '/product/continuity/',
          },
          {
            name: 'Continuity photos',
            text: 'Taken on your phone and kept on the style or the scene as you shoot. Every photo records who added it and when.',
            href: '/product/continuity/',
          },
          {
            name: 'Wigs and hairpieces',
            text: 'Each one is an inventory item with its photos, costs and condition, listed on the styles it’s part of. Hired pieces keep who they came from and when they go back, and anything damaged, lost or needing repair is flagged.',
            href: '/product/inventory/',
          },
          {
            name: 'Notes',
            text: 'Each style has a note that travels with it wherever it plays, and the department keeps its own note on every scene.',
            href: '/product/continuity/',
          },
          {
            name: 'Research',
            text: 'References as photos, links and notes, pinned to the characters and scenes they’re for, and tracked from proposed to approved.',
            href: '/product/research/',
          },
        ],
      },
      moment: {
        heading: 'When the scene picks up three weeks later',
        text: [
          'Open the scene and it’s there: who’s in it, the style each of them wears, your photos and your note. Open the style and you have every photo of it, the pieces in it and every other scene it plays.',
          'Nobody scrolls back through a camera roll. Scenes you’ve already opened stay readable when the signal drops.',
        ],
      },
      papers: {
        heading: 'The paperwork, built when you ask',
        lede: 'Reports come from the production as it stands, so they’re never a version behind.',
        href: '/product/reports/',
        items: [
          ['Hair plot', 'Every style, character by scene, across the whole script or only the days you choose.'],
          [
            'Continuity book',
            'Every photo of every style, in scene order or shoot order, with notes and a cover page if you want them.',
          ],
          ['Hair inventory', 'Every item and crate with its condition and cost, grouped by folder or as one list.'],
        ],
      },
      questions: [
        [
          'Where is my script read?',
          'On your device. StageRoll keeps what it reads from it, such as the scene list and the cast.',
        ],
        [
          'Are hair and makeup one department?',
          'They’re two departments in StageRoll, each with its own records, photos and reports, in the same production. Anyone can switch between them at any time.',
        ],
        [
          'Does it work for a series?',
          'Yes. Each episode has its own drafts and its own scene numbers. Several episodes in one production are part of the Pro and Enterprise plans.',
        ],
        ['Do my crew need to pay?', 'No. Plans are per production, and everyone invited to it joins free.'],
        [
          'What does it run on?',
          'StageRoll is built for iPhone, iPad and Android, and your department follows you between them.',
        ],
        [
          'Does it work without signal?',
          'Scenes you’ve opened stay readable offline, and research can be added with no signal. Enhanced offline mode is coming soon.',
        ],
      ],
    },
    related: [
      { href: '/departments/makeup/', label: 'StageRoll for makeup' },
      continuity,
      inventory,
      research,
      reports,
    ],
    plan: true,
  },
  {
    slug: 'makeup',
    title: 'Makeup',
    icon: 'eye',
    summary: 'Looks and their pieces',
    metaTitle: 'Makeup continuity software for film and TV',
    description:
      'Makeup continuity for film and TV: every look on record against the script with photos and notes, the appliances in each, the makeup plot and the continuity book.',
    updated: '2026-11-28',
    lede: 'StageRoll is the makeup department’s record of every look, every photo and every piece that goes into it, tied to the script it’s shot from.',
    features: [
      ['Looks', 'Numbered per character, each with its photos, note, pieces and scenes.', 'eye'],
      ['Your own department', 'Makeup has its own photos, notes, lists and reports, apart from hair’s.', 'layers'],
      [
        'The pieces',
        'Appliances and the other pieces in a look are inventory items, with photos, costs and condition.',
        'box',
      ],
      [
        'Status and flags',
        'Anything damaged, lost or needing repair is flagged, so problems are easy to spot.',
        'flag',
      ],
      ['Research', 'References pinned to characters and scenes, and signed off.', 'pin'],
      ['The makeup plot', 'Every look, character by scene.', 'grid'],
      ['The continuity book', 'Every photo of every look, in scene order or shoot order.', 'camera'],
      ['The makeup inventory', 'Every item and crate, with condition and cost.', 'table'],
    ],
    story: {
      headline: 'Makeup continuity, look by look.',
      intro: {
        heading: 'Every look, on the scene it plays',
        text: [
          'A look has to be the same on every day it’s shot, however far apart those days fall. StageRoll keeps each character’s looks against the script, numbered for that character, with the photos and the note on the look itself.',
          'It starts from the script. Import a PDF or Final Draft file and the scenes and the cast are there to break down. When the next draft lands, your work stays attached.',
        ],
      },
      facts: [
        ['Read on your device', 'StageRoll reads your script on your phone and keeps what it reads from it, such as the scene list and the cast.'],
        ['A department of its own', 'Makeup has its own records, photos, notes and reports, apart from hair’s.'],
        ['Free for crew', 'The production holds the plan. Everyone you invite joins free.'],
      ],
      areas: {
        heading: 'Everything the department keeps',
        lede: 'From the first reference to the last shooting day.',
        items: [
          {
            name: 'Looks',
            text: 'Each character’s looks, numbered in order, on the scenes they play. A look carries its photos, its note and the pieces in it, and reads as done everywhere once you wrap it.',
            href: '/product/continuity/',
          },
          {
            name: 'Continuity photos',
            text: 'Taken on your phone and kept on the look or the scene as you shoot. Every photo records who added it and when.',
            href: '/product/continuity/',
          },
          {
            name: 'Appliances and pieces',
            text: 'The appliances and other pieces in a look are inventory items, with their photos, costs and condition, listed on the looks they’re part of. Anything damaged, lost or needing repair is flagged.',
            href: '/product/inventory/',
          },
          {
            name: 'Notes',
            text: 'Each look has a note that travels with it wherever it plays, and the department keeps its own note on every scene.',
            href: '/product/continuity/',
          },
          {
            name: 'Research',
            text: 'References as photos, links and notes, pinned to the characters and scenes they’re for, and tracked from proposed to approved.',
            href: '/product/research/',
          },
        ],
      },
      moment: {
        heading: 'When the same look is called again',
        text: [
          'Open the scene and it’s there: who’s in it, the look each of them wears, your photos and your note. Open the look and you have every photo of it, the pieces in it and every other scene it plays.',
          'Nobody scrolls back through a camera roll. Scenes you’ve already opened stay readable when the signal drops.',
        ],
      },
      papers: {
        heading: 'The paperwork, built when you ask',
        lede: 'Reports come from the production as it stands, so they’re never a version behind.',
        href: '/product/reports/',
        items: [
          ['Makeup plot', 'Every look, character by scene, across the whole script or only the days you choose.'],
          [
            'Continuity book',
            'Every photo of every look, in scene order or shoot order, with notes and a cover page if you want them.',
          ],
          ['Makeup inventory', 'Every item and crate with its condition and cost, grouped by folder or as one list.'],
        ],
      },
      questions: [
        [
          'Where is my script read?',
          'On your device. StageRoll keeps what it reads from it, such as the scene list and the cast.',
        ],
        [
          'Are hair and makeup one department?',
          'They’re two departments in StageRoll, each with its own records, photos and reports, in the same production. Anyone can switch between them at any time.',
        ],
        [
          'Does it work for a series?',
          'Yes. Each episode has its own drafts and its own scene numbers. Several episodes in one production are part of the Pro and Enterprise plans.',
        ],
        ['Do my crew need to pay?', 'No. Plans are per production, and everyone invited to it joins free.'],
        [
          'What does it run on?',
          'StageRoll is built for iPhone, iPad and Android, and your department follows you between them.',
        ],
        [
          'Does it work without signal?',
          'Scenes you’ve opened stay readable offline, and research can be added with no signal. Enhanced offline mode is coming soon.',
        ],
      ],
    },
    related: [{ href: '/departments/hair/', label: 'StageRoll for hair' }, continuity, inventory, research, reports],
    plan: true,
  },
  {
    slug: 'props',
    title: 'Props',
    icon: 'clapper',
    summary: 'Who carries what, scene by scene',
    metaTitle: 'Props continuity and inventory software for film and TV',
    description:
      'Props continuity and inventory for film and TV: what each character carries in every scene, the set props, hire returns, QR codes and a props list by scene.',
    updated: '2026-11-28',
    lede: 'StageRoll is the props department’s record of what’s in every scene, who carries it, and where each prop is now.',
    features: [
      [
        'Character props',
        'What each character carries, scene by scene, and their personal props on their own page.',
        'user',
      ],
      ['Set props', 'The props on the set in each scene, beside the cast’s.', 'clapper'],
      ['Props breakdown', 'Every prop in every scene, grouped by character or by scene.', 'list'],
      ['Hire and returns', 'Who a prop came from, the paperwork, and when it goes back.', 'clock'],
      [
        'Crates and QR codes',
        'Pack props into labelled crates. Every prop and crate has a code your phone scans.',
        'qr',
      ],
      [
        'Status and flags',
        'Anything damaged, lost or needing repair is flagged, so problems are easy to spot.',
        'flag',
      ],
      ['Research', 'References pinned to characters, scenes and sets, and turned into stock when you buy.', 'pin'],
      ['Props by scene', 'What’s on set, scene by scene, in scene order or shoot order.', 'table'],
    ],
    story: {
      headline: 'Props continuity and inventory, kept together.',
      intro: {
        heading: 'Who carries what, scene by scene',
        text: [
          'Props are followed two ways at once: by the scene they play in and by the thing itself. In StageRoll a prop in a scene is the inventory item, given to a character or placed on the set, so the breakdown and the stock are one record.',
          'It starts from the script. Import a PDF or Final Draft file and the scenes and the cast are there to break down. When the next draft lands, your work stays attached.',
        ],
      },
      facts: [
        ['Read on your device', 'StageRoll reads your script on your phone and keeps what it reads from it, such as the scene list and the cast.'],
        [
          'One production, every department',
          'Costume, props, hair, makeup and sets work against the same scenes and characters.',
        ],
        ['Free for crew', 'The production holds the plan. Everyone you invite joins free.'],
      ],
      areas: {
        heading: 'Everything the department keeps',
        lede: 'From the breakdown to the last return.',
        items: [
          {
            name: 'Character props',
            text: 'What each character carries in each scene, and their personal props gathered on the character’s own page.',
            href: '/product/continuity/',
          },
          {
            name: 'Set props',
            text: 'The props on the set in a scene, listed beside the cast’s.',
            href: '/product/continuity/',
          },
          {
            name: 'Each use',
            text: 'A prop’s use in a scene has its own note and its own reference photos, apart from the item’s. How it’s set for this scene stays with this scene.',
            href: '/product/continuity/',
          },
          {
            name: 'The props inventory',
            text: 'Every prop with its photos, costs and condition, in folders or packed into crates. Hired and borrowed props keep who they came from, the paperwork and when they go back.',
            href: '/product/inventory/',
          },
          {
            name: 'Research',
            text: 'References as photos, links and notes, pinned to characters, scenes and sets and signed off. When you buy the prop, the reference becomes stock, with its price and source carried across.',
            href: '/product/research/',
          },
          {
            name: 'Codes and scanning',
            text: 'A QR code on every prop and crate. Point your phone at it and it opens, even at the back of a dark truck.',
            href: '/product/scanning/',
          },
        ],
      },
      moment: {
        heading: 'When someone asks which scenes the briefcase is in',
        text: [
          'Open the prop and it shows every scene it plays. Open any of those scenes and you see who carries it, what else is on the set, and your note and reference photos for that use.',
          'The props breakdown gives you the same thing for the whole script: every prop in every scene, grouped by character or by scene.',
        ],
      },
      papers: {
        heading: 'The paperwork, built when you ask',
        lede: 'Reports come from the production as it stands, so they’re never a version behind.',
        href: '/product/reports/',
        items: [
          [
            'Props by scene',
            'What’s on set, scene by scene, in scene order or shoot order, for the whole script or only the days you choose.',
          ],
          ['Props inventory', 'Every prop and crate with its condition and cost, grouped by folder or as one list.'],
          ['Your columns', 'Both print the columns you tick, with or without a photo of each prop.'],
        ],
      },
      questions: [
        [
          'Where is my script read?',
          'On your device. StageRoll keeps what it reads from it, such as the scene list and the cast.',
        ],
        [
          'Can one prop be in several scenes?',
          'Yes. It’s one inventory item, placed in as many scenes as it plays, and each use has its own note and reference photos.',
        ],
        [
          'Are props and set dressing separate?',
          'Yes. Set dressing belongs to the set department, which lists it once on the set. Props belong to the props department and are placed scene by scene.',
        ],
        ['Do my crew need to pay?', 'No. Plans are per production, and everyone invited to it joins free.'],
        [
          'What does it run on?',
          'StageRoll is built for iPhone, iPad and Android, and your department follows you between them.',
        ],
        [
          'Does it work without signal?',
          'Scenes you’ve opened stay readable offline, and research can be added with no signal. Enhanced offline mode is coming soon.',
        ],
      ],
    },
    related: [continuity, inventory, research, reports, scanning],
    plan: true,
  },
  {
    slug: 'sets',
    title: 'Sets and set dressing',
    icon: 'pin',
    summary: 'Every set and how it’s dressed',
    metaTitle: 'Set dressing and set decoration software for film and TV',
    description:
      'Set dressing for film and TV: every set on record with its location, scenes and dates, its dressing listed once from the inventory, and research pinned to each set.',
    updated: '2026-11-17',
    lede: 'StageRoll is the set department’s record of each set: where it is, the scenes that play there, how it’s dressed and when it has to be ready.',
    features: [
      ['Locations', 'Sets grouped by location, with the address where it’s a real place.', 'pin'],
      ['Dressing', 'Every piece on the set is an inventory item, with its photos, costs and condition.', 'box'],
      [
        'What needs sorting first',
        'On a scene, dressing that’s damaged, lost or needing repair is listed first.',
        'flag',
      ],
      ['Set photos', 'The set’s own photos, with the reference photos of everything dressing it.', 'camera'],
      ['Shoot days', 'The days each set shoots, and which scenes, from the schedule.', 'calendar'],
      ['Research', 'References pinned to a set, signed off, and turned into stock when you buy.', 'grid'],
      [
        'Crates and QR codes',
        'Pack dressing into labelled crates. Every piece and crate has a code your phone scans.',
        'qr',
      ],
      ['The set inventory', 'All the dressing and crates, with condition and cost.', 'table'],
    ],
    story: {
      headline: 'Every set, and everything dressing it.',
      intro: {
        heading: 'Dress it once, see it on every scene',
        text: [
          'A set plays in many scenes, so its dressing is listed once, on the set. Tag the set onto the scenes that play there and each of them shows the set and its dressing. Anything particular to one scene goes in that scene’s note.',
          'Sets sit under their locations, with an address where it’s a real place, and each set has its own number, description and photos.',
        ],
      },
      facts: [
        [
          'One production, every department',
          'Costume, props, hair, makeup and sets work against the same scenes and characters.',
        ],
        ['Dates on every set', 'Prep, ready and wrap, beside the days the schedule shoots it.'],
        ['Free for crew', 'The production holds the plan. Everyone you invite joins free.'],
      ],
      areas: {
        heading: 'Everything the department keeps',
        lede: 'From the first reference to wrap.',
        items: [
          {
            name: 'Sets and locations',
            text: 'Every set as its own record, grouped under its location. A location is a heading over its sets, with an address for a real place and none for a build on a stage.',
            href: '/product/inventory/',
          },
          {
            name: 'Dressing',
            text: 'Every piece on a set is an inventory item, with its photos, costs and condition. Hired and borrowed pieces keep who they came from and when they go back.',
            href: '/product/inventory/',
          },
          {
            name: 'Dates and shoot days',
            text: 'Each set’s prep, ready and wrap dates, and the days the schedule shoots it, with which scenes.',
            href: '/product/schedule/',
          },
          {
            name: 'Set photos',
            text: 'The set’s own photos, together with the reference photos of everything dressing it.',
            href: '/product/inventory/',
          },
          {
            name: 'Research',
            text: 'References as photos, links and notes, pinned to the set they’re for and signed off. When you buy the piece, the reference becomes stock, with its price and source carried across.',
            href: '/product/research/',
          },
          {
            name: 'Codes and crates',
            text: 'Pack dressing into labelled crates. Every piece and crate has a QR code your phone opens with a scan.',
            href: '/product/scanning/',
          },
        ],
      },
      moment: {
        heading: 'When a set is back on the schedule',
        text: [
          'Open the set and you have its dressing, its photos, the scenes that play there and the days they shoot.',
          'On each of those scenes, dressing that’s damaged, lost or needing repair is listed first, so it’s sorted before the take.',
        ],
      },
      papers: {
        heading: 'The paperwork, built when you ask',
        lede: 'Reports come from the production as it stands, so they’re never a version behind.',
        href: '/product/reports/',
        items: [
          ['Set inventory', 'All the dressing and crates, with condition and cost.'],
          ['Your columns', 'It prints the columns you tick, with or without a photo of each piece.'],
          ['Grouped your way', 'By folder, or as one list.'],
        ],
      },
      questions: [
        [
          'Do I need a script to start?',
          'No. Add your sets and their dressing straight away. Scenes come from the script when it’s imported, or you can add them by hand, and then you tag each set onto the scenes that play there.',
        ],
        [
          'Are props and set dressing separate?',
          'Yes. Set dressing belongs to the set department, which lists it once on the set. Props belong to the props department and are placed scene by scene.',
        ],
        [
          'Can a set be a build on a stage?',
          'Yes. A location’s address is optional, and a set doesn’t need a location at all.',
        ],
        ['Do my crew need to pay?', 'No. Plans are per production, and everyone invited to it joins free.'],
        [
          'What does it run on?',
          'StageRoll is built for iPhone, iPad and Android, and your department follows you between them.',
        ],
        [
          'Does it work without signal?',
          'Scenes you’ve opened stay readable offline, and research can be added with no signal. Enhanced offline mode is coming soon.',
        ],
      ],
    },
    related: [inventory, research, schedule, script, reports],
    plan: true,
  },
]
