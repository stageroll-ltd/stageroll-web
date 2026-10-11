import { photos, type Photo as PhotoSlot, type PhotoKey } from '../photos'

// A photograph slot. Licensed file if there is one; otherwise the comp in the
// dev server and a quiet placeholder in the build (comps are not ours to ship).
export function Photo({ slot, className }: { slot: PhotoKey; className?: string }) {
  const photo: PhotoSlot = photos[slot]
  const src = photo.file ? `/photos/${photo.file}` : import.meta.env.DEV ? photo.comp : null
  if (!src) return <div className={`photo photo-empty ${className ?? ''}`} role="img" aria-label={photo.alt} />
  return <img className={`photo ${className ?? ''}`} src={src} alt={photo.alt} loading="lazy" referrerPolicy="no-referrer" />
}
