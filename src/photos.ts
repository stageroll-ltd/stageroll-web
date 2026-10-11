// Every photograph on the site, by slot. `comp` is a Getty comp, shown only by
// the dev server so the page can be designed; the built site never ships it.
// When a photograph is licensed, drop the file in public/photos/ and set
// `file`, and every build shows it.
export type Photo = { alt: string; comp: string; file?: string }

const G = (id: string, slug: string, c: string) =>
  `https://media.gettyimages.com/id/${id}/photo/${slug}.jpg?s=612x612&w=0&k=20&c=${c}`

export const photos = {
  fitting: { alt: 'A costume designer fitting a dress on an actor', comp: G('2228651510', 'non-binary-designer-is-fitting-an-elegant-dress-on-young-beautiful-woman', 'Qwwr61EBdFAt0Ls_zLzM9HratFc3IPMSPpgJkF0nmKM=') },
  hair: { alt: 'Hair being set at a dressing room mirror', comp: G('1474799619', 'hairdressers-make-beautiful-curls-with-a-curler-on-the-hair-of-a-theater-actress', 'Fnh0u-JEcXw_8TcAix2Hkmq2PiI00TCtmk5rRTa61L0=') },
  cases: { alt: 'Flight cases stacked outside a venue', comp: G('998264254', 'boxes-stage-equipment', 'jFpjpT2WFRLwfgNn45hVKPTbve1rtNrX4LfSYqOJMv0=') },
  board: { alt: 'A cork board of pinned photographs', comp: G('1354718071', 'collection-of-instant-photo-memories', 'ywWz18gvLtTw9wqtd9xJXYIc3OG0DK-AAzR2zKPcaks=') },
  onset: { alt: 'Makeup being checked on an actor under studio lights', comp: G('1028404552', 'makeup-artist-and-wardrobe-stylist-working-on-actor-behind-the-scenes-on-a-film-set', 'T0L66julBefKH28L04f-yLZZEOUEH6hdqnV96DLP1MY=') },
  seam: { alt: 'A tailor at a cutting table', comp: G('1033222894', 'seamstress-at-work', 'Fw0YS5CZ9SnbKlXAySdzeWUQGQlGip-FUfv9wmKbz9g=') },
  makeup: { alt: 'A makeup artist at work', comp: G('1297823171', 'makeup-artist-at-work-in-a-studio', 'TsW_w_hWindxV7ibymNxRm97vH4md5LxE1BsmHvS4C8=') },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos
