import { photos, type Photo as PhotoSlot, type PhotoKey } from '../photos'

// A photograph slot: its file if there is one, else a quiet placeholder.
// `eager` is for the photographs on screen at load, the hero's.
export function Photo({ slot, className, eager = false }: { slot: PhotoKey; className?: string; eager?: boolean }) {
  const photo: PhotoSlot = photos[slot]
  const src = photo.file ? `/photos/${photo.file}` : null
  if (!src) return <div className={`photo photo-empty ${className ?? ''}`} role="img" aria-label={photo.alt} />
  return (
    <img
      className={`photo ${className ?? ''}`}
      src={src}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
