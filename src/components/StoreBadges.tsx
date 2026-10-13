import { APP_STORE_URL, GOOGLE_PLAY_URL } from '../links'
import { Icon } from './Icon'

// Where to get the app. Apple and Google allow only their official badge
// artwork, unaltered, and only for a live (or pre-order) listing, and neither
// lets the Apple or Google Play logo stand in a badge of our own. So until a
// listing exists (links.ts) this is one plain "coming soon" mark with no store
// logos. At launch, swap the links below for the official badges, downloaded
// from Apple's and Google's marketing pages.
export function StoreBadges({ light = false }: { light?: boolean }) {
  const tone = light ? ' light' : ''
  if (APP_STORE_URL === '#' && GOOGLE_PLAY_URL === '#') {
    return (
      <div className="stores">
        <span className={`store soon${tone}`}>
          <Icon name="phone" />
          <span>
            <small>Coming soon to</small>
            <b>iPhone, iPad and Android</b>
          </span>
        </span>
      </div>
    )
  }
  return (
    <div className="stores">
      {APP_STORE_URL !== '#' && (
        <a className={`store${tone}`} href={APP_STORE_URL}>
          <b>App Store</b>
        </a>
      )}
      {GOOGLE_PLAY_URL !== '#' && (
        <a className={`store${tone}`} href={GOOGLE_PLAY_URL}>
          <b>Google Play</b>
        </a>
      )}
    </div>
  )
}
