import { useEffect } from 'react'

// The home page's scroll story, on a wide screen with motion allowed (the same
// query styles.css uses for the story's layout). GSAP and ScrollTrigger load
// only here, in the browser, after the page is up.
//
//   1. The hero holds still while you scroll. The words lift away, the four
//      photographs fan out and fall off the sides, and the phone rises out of
//      the bottom edge and glides to the left, fully in view.
//   2. "Modern by design" arrives on the right, then the three steps, one at a
//      time, the phone's screen changing with each.
//   3. The story holds its last frame while the features page, white with
//      a rounded top, slides up over it.
//   4. Down that page the four features come in one by one as they reach
//      the screen, each title and then its points fading up from below.
//
// Everything is scrubbed to the scroll position, so it runs backwards too.
// Phones and reduced motion get the plain page (two sections, no pinning).

const QUERY = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'

/** The hero's unit, --u in styles.css: a pixel on a 1440-wide screen. */
function unit(): number {
  const w = window.innerWidth
  const h = window.innerHeight
  return Math.min(Math.min(Math.max(0.75, w / 2880 + 0.5), 1.25), h / 900)
}

type Gsap = typeof import('gsap').gsap
type Trigger = typeof import('gsap/ScrollTrigger').ScrollTrigger

/** Scroll per unit of the timeline, in screen heights: the hero's departure
 *  is one unit, so it takes 0.87 of a screen. */
const SCROLL_PER_UNIT = 0.87

// How it works, in timeline units: the heading lands by 1.05; step 1 waits
// until FIRST_STEP, and each step holds STEP for its turn, leaving after
// STEP_LEAVES. The last one stays while the features page covers it: one
// screen of scroll, the page's own overlap (styles.css).
const FIRST_STEP = 1.75
const STEP = 1.6
const STEP_LEAVES = 1.25

function story(gsap: Gsap, ScrollTrigger: Trigger) {
  const root = document.querySelector<HTMLElement>('.story')
  if (!root) return
  const copy = root.querySelector('.hero-copy')
  const phone = root.querySelector('.hero-stage .phone')
  const cards = [...root.querySelectorAll('.hero-card')]
  const shots = [...root.querySelectorAll('.hero-stage .scr')]
  const head = root.querySelector('.how-head')
  const steps = [...root.querySelectorAll('.steps li')]
  if (!copy || !phone || !head) return

  const u = unit
  const tl = gsap.timeline({ defaults: { ease: 'none' }, paused: true })

  // 1. The hero gives way. Every start is stated (fromTo), not read off the
  // page: the script can arrive while the load animation still has the phone
  // and photographs lowered and unseen, and that is not where they rest.
  tl.fromTo(copy, { y: 0, autoAlpha: 1 }, { y: () => -90 * u(), autoAlpha: 0, duration: 0.45 }, 0)
  // Where each photograph rests and where it falls to. GSAP takes over a
  // card's CSS `rotate` when it first moves it (folding it into its own
  // transform), so the resting tilt is stated here too, the same as
  // styles.css has it: the cards are tilted before the script arrives and
  // stay exactly so after.
  const rest = [-14, 14, -6, 6]
  const away = [
    { x: -560, y: 300, rotation: -30 },
    { x: 560, y: 300, rotation: 30 },
    { x: -420, y: 380, rotation: -16 },
    { x: 420, y: 380, rotation: 16 },
  ]
  cards.forEach((card, i) => {
    const to = away[i]
    if (!to) return
    tl.fromTo(
      card,
      { x: 0, y: 0, rotation: rest[i] ?? 0, autoAlpha: 1 },
      { x: () => to.x * u(), y: () => to.y * u(), rotation: to.rotation, autoAlpha: 0, duration: 0.8, ease: 'power1.in' },
      0.04 * i,
    )
  })
  // The phone's top goes from the hero's foot (100% - 406u) to the middle of
  // the screen, and its centre from the middle to 320u left of it.
  const phoneX = () => -320 * u()
  const phoneY = () => (window.innerHeight - 620 * u()) / 2 - (window.innerHeight - 406 * u())
  tl.fromTo(phone, { x: 0, y: 0 }, { x: phoneX, y: phoneY, duration: 1, ease: 'power2.inOut' }, 0)

  // 2. How it works, one step at a time.
  tl.fromTo(head, { autoAlpha: 0, y: () => 30 * u() }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.65)
  steps.forEach((step, i) => {
    const at = FIRST_STEP + STEP * i
    // shots[0] is the hero's home screen; step i shows shots[i + 1].
    const from = shots[i]
    const to = shots[i + 1]
    if (from && to) {
      tl.to(from, { autoAlpha: 0, duration: 0.25 }, at - 0.1)
      tl.to(to, { autoAlpha: 1, duration: 0.25 }, at - 0.1)
    }
    tl.fromTo(step, { autoAlpha: 0, y: () => 24 * u() }, { autoAlpha: 1, y: 0, duration: 0.3 }, at)
    if (i < steps.length - 1) tl.to(step, { autoAlpha: 0, y: () => -24 * u(), duration: 0.3 }, at + STEP_LEAVES)
  })

  // The second phone slides out from behind the first to its left, a little
  // smaller and lower, at the first step with a side screen (data-from), and
  // stays out, its screen changing with each step after, as the first's does.
  const phone2 = root.querySelector<HTMLElement>('.hero-stage .phone2')
  if (phone2) {
    const from = Number(phone2.dataset.from ?? 0)
    // How far it slides: 265u, or less in a narrow window, so its left edge
    // (it is 0.9 of the first phone's 300u wide) stays 24px inside the screen.
    const slide = () => {
      const room = window.innerWidth / 2 + phoneX() - 135 * u() - 24
      return Math.min(265 * u(), Math.max(90 * u(), room))
    }
    tl.fromTo(
      phone2,
      { x: phoneX, y: phoneY, scale: 0.9, autoAlpha: 0 },
      { x: () => phoneX() - slide(), y: () => phoneY() + 24 * u(), scale: 0.9, autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
      FIRST_STEP + STEP * from,
    )
    const sides = [...phone2.querySelectorAll('.scr')]
    sides.forEach((side, k) => {
      const prev = sides[k - 1]
      if (!prev) return
      const at = FIRST_STEP + STEP * (from + k) - 0.1
      tl.to(prev, { autoAlpha: 0, duration: 0.25 }, at)
      tl.to(side, { autoAlpha: 1, duration: 0.25 }, at)
    })
  }

  // 3. Hold the last step for one more screen while the features page
  // slides up over the frame.
  tl.to({}, { duration: STEP_LEAVES + 1 / SCROLL_PER_UNIT })

  // Pinned for as long as the timeline runs, at SCROLL_PER_UNIT a unit.
  ScrollTrigger.create({
    animation: tl,
    trigger: root,
    start: 'top top',
    end: () => `+=${window.innerHeight * SCROLL_PER_UNIT * tl.duration()}`,
    pin: true,
    scrub: 0.6,
    invalidateOnRefresh: true,
    // The header steps aside while the story plays and comes back once the
    // features page has risen over it (`in-story`, styles.css).
    onToggle: (self) => document.documentElement.classList.toggle('in-story', self.isActive),
  })
}

// Down the features page, each feature's title and then its points fade up
// from a little below as they come up the screen, the way Apple's pages do.
// Measured in the page's own pixels, not the hero's unit.
function features(gsap: Gsap) {
  document.querySelectorAll('.feature').forEach((feature) => {
    const title = feature.querySelector('.f-title')
    const points = feature.querySelector('.pts')
    // Each block on its own trigger, played out as it comes up the screen:
    // from its top reaching 90% of the way down to reaching 55%.
    const on = (el: Element) => ({ trigger: el, start: 'top 90%', end: 'top 55%', scrub: 1 })
    if (title) gsap.fromTo(title, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, ease: 'power2.out', scrollTrigger: on(title) })
    if (points) gsap.fromTo(points, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, ease: 'power2.out', scrollTrigger: on(points) })
  })
}

export function useStoryMotion() {
  useEffect(() => {
    let cancelled = false
    let mm: { revert(): void } | undefined
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const media = gsap.matchMedia()
      mm = media
      // Everything made inside is undone if the screen narrows or motion is turned off.
      media.add(QUERY, () => {
        // `pinned` lets the features page overlap the story (styles.css). It
        // goes on first, so the triggers below measure the final layout, and
        // in the same frame as the pin, so the overlap never shows without
        // the pinned story's space under it.
        document.documentElement.classList.add('pinned')
        story(gsap, ScrollTrigger)
        features(gsap)
        return () => document.documentElement.classList.remove('pinned', 'in-story')
      })
    })()
    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [])
}
