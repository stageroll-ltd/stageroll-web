// Every photograph on the site, by slot: a file in public/photos/, or a quiet
// placeholder until one lands there.
export type Photo = { alt: string; file?: string }

// The departments' photographs, on the home page. Four are Unsplash (free
// licence): each original download is kept in originals/photos/, which is
// not published, and the crop here is 3:4, WebP at 750 wide. The props
// photograph is our own (originals/photos/props.jpg), WebP at its own 666.
export const photos = {
  // unsplash.com/photos/3BF8aytKNGY, Megan Lee
  costume: { alt: 'A colourful rail of clothes on hangers', file: 'costume.webp' },
  // unsplash.com/photos/MMz03PyCOZg, Baylee Gramling
  hair: { alt: 'Curling tongs in long brown hair', file: 'hair.webp' },
  // unsplash.com/photos/ShAHFTy-HKQ, Romina Farías
  makeup: { alt: 'A lit vanity mirror with makeup on the table', file: 'makeup.webp' },
  // unsplash.com/photos/Ht7zJAgYJSM, K. Mitch Hodge
  set: { alt: 'A period location shoot with a camera crane', file: 'set.webp' },
  // Our own.
  props: { alt: 'Period props laid out on a workbench', file: 'props.webp' },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
