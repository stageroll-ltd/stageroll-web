// Every photograph on the site, by slot: a file in public/photos/, or a quiet
// placeholder until one lands there.
export type Photo = { alt: string; file?: string }

// One photograph per department, in the hero. Four are Unsplash (free
// licence; the original download sits beside each crop in public/photos/),
// props is our own. Each is cropped to the hero card's 3:4 and sized for it.
export const photos = {
  // unsplash.com/photos/3BF8aytKNGY, Megan Lee
  costume: { alt: 'A colourful rail of clothes on hangers', file: 'costume.jpg' },
  // Our own, cropped from props.jpeg beside it.
  props: { alt: 'A props table: a treasure chest, an old map, keys and a dagger', file: 'props.jpg' },
  // unsplash.com/photos/MMz03PyCOZg, Baylee Gramling
  hair: { alt: 'Curling tongs in long brown hair', file: 'hair.jpg' },
  // unsplash.com/photos/ShAHFTy-HKQ, Romina Farías
  makeup: { alt: 'A lit vanity mirror with makeup on the table', file: 'makeup.jpg' },
  // unsplash.com/photos/Ht7zJAgYJSM, K. Mitch Hodge
  set: { alt: 'A period location shoot with a camera crane', file: 'set.jpg' },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
