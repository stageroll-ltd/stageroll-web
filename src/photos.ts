// Every photograph on the site, by slot: a file in public/photos/, or a quiet
// placeholder until one lands there.
export type Photo = { alt: string; file?: string }

// The hero's four photographs, all Unsplash (free licence). Each original
// download is kept in originals/photos/, which is not published; the crop
// here is the hero card's 3:4, WebP at 750 wide (twice the card's largest
// size). A props photo of our own waits in originals/photos/ too.
export const photos = {
  // unsplash.com/photos/3BF8aytKNGY, Megan Lee
  costume: { alt: 'A colourful rail of clothes on hangers', file: 'costume.webp' },
  // unsplash.com/photos/MMz03PyCOZg, Baylee Gramling
  hair: { alt: 'Curling tongs in long brown hair', file: 'hair.webp' },
  // unsplash.com/photos/ShAHFTy-HKQ, Romina Farías
  makeup: { alt: 'A lit vanity mirror with makeup on the table', file: 'makeup.webp' },
  // unsplash.com/photos/Ht7zJAgYJSM, K. Mitch Hodge
  set: { alt: 'A period location shoot with a camera crane', file: 'set.webp' },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
