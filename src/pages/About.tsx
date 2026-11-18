import { company } from '../Layout'
import { Kept } from './shows'
import { Showcase, type Show } from './Showcase'

// About, told in ruled bands (Showcase.tsx): a plain opening with no
// drawing, why StageRoll exists in two columns, how it is built beside a
// drawing, and the company's details as ruled cells.

const show: Show = {
  bands: [
    {
      kind: 'two',
      heading: 'Why it exists',
      text: [
        'A department’s record of a production is scattered: the script in one app, the breakdown in a spreadsheet, continuity photos across several camera rolls, the schedule on a call sheet, and the whereabouts of any given item in someone’s head. Finding out what a scene needs, or which crate something went back into, takes a radio call and a search.',
        'StageRoll keeps that record in one place, and keeps it current. The script becomes the scenes and characters everything else hangs off, and each new draft updates them without losing work. Every change, style, look, prop and photo is tied to the scenes it serves. The schedule, the research and the paperwork come from the same production, so a new draft on Tuesday is in the reports on Wednesday.',
      ],
    },
    {
      kind: 'split',
      heading: 'How we build it',
      text: [
        'Set work happens standing up, with one hand, in a hurry. So StageRoll is made for the phone or tablet you already carry, on iPhone, iPad and Android, and what you’ve opened stays readable when the signal drops. The script is read on your own device, and the file is never uploaded.',
        <>
          A production’s work stays private. In the app, breakdowns, photos and records are shown only to the people on
          the production. We don’t sell data, show ads, or use your work to train AI. The details are in our{' '}
          <a href="/privacy/">privacy policy</a>.
        </>,
      ],
      art: <Kept />,
    },
    {
      kind: 'grid',
      heading: 'Company details',
      items: [
        ['Legal name', company.name],
        ['Registered in', `England and Wales, company number ${company.number}`],
        ['Registered office', company.address.join(', ')],
        [
          'Email',
          <a key="email" href={`mailto:${company.email}`}>
            {company.email}
          </a>,
        ],
      ],
    },
  ],
}

export function About() {
  return (
    <Showcase
      title="About StageRoll"
      lede="StageRoll Ltd is an independent software company registered in England and Wales. We make StageRoll, production management software for the costume, props, hair, makeup and sets departments on film and TV productions of any size."
      show={show}
    />
  )
}
