import { photos, type Photo as PhotoSlot, type PhotoKey } from '../photos'

// What a phone gets in place of a hero photograph: a 1x1 transparent GIF.
// The hero cards are display:none at 900px and narrower (styles.css, keep the
// two in step), and a hidden <img> still downloads, so the <picture> below
// gives a phone this instead of the file.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// A photograph slot: its file if there is one, else a quiet placeholder.
// `eager` is for the photographs on screen at load, the hero's: they load
// straight away on a wide screen and not at all on a phone, which hides them.
export function Photo({ slot, className, eager = false }: { slot: PhotoKey; className?: string; eager?: boolean }) {
  const photo: PhotoSlot = photos[slot]
  const src = photo.file ? `/photos/${photo.file}` : null
  if (!src) return <div className={`photo photo-empty ${className ?? ''}`} role="img" aria-label={photo.alt} />
  const img = <img className={`photo ${className ?? ''}`} src={src} alt={photo.alt} loading={eager ? undefined : 'lazy'} />
  if (!eager) return img
  return (
    <picture>
      <source media="(max-width: 900px)" srcSet={BLANK} />
      {img}
    </picture>
  )
}
