// The lines in the home page's ink band (Home.tsx, "Private by default"):
// kin to the hero's ribbon (heroLines.ts, whose curve this draws with), in
// a different hand. Half as many lines, finer, in the sunset's lighter
// colours for a dark ground; they come up from the band's foot inside the
// column's right rail, cross it and leave at the window's top corner, and
// the twist runs through them a good deal faster. They are placed by the
// column, not the window, so they stay beside the band's words however wide
// the window is. A wide screen only;
// still with motion reduced, and stopped while the band is off screen.

import { LOOP, paths, type Ribbon } from './heroLines'

/** Every other one of the hero's lines. */
const EVERY = 2
/** How much faster than the hero's the round runs. */
const PACE = 1.7

// Soft, glow, top, mid (home.css): the first line is the palest.
const TONES = [
  [0xff, 0xd0, 0xc8],
  [0xff, 0x8f, 0x45],
  [0xe2, 0x36, 0x6e],
  [0xc4, 0x2a, 0x60],
] as const

function tone(t: number): string {
  const at = Math.min(t, 0.9999) * (TONES.length - 1)
  const a = TONES[Math.floor(at)] ?? TONES[0]
  const b = TONES[Math.floor(at) + 1] ?? a
  const mix = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * (at % 1))
  return `rgb(${mix(0)} ${mix(1)} ${mix(2)})`
}

/**
 * The ribbon for the page's column, `w` by `h`, in a band that runs `over`
 * further to the window's edge: up from the foot at about three quarters of
 * the way across the column, clear of the words, over the rail and out at
 * the window's top right corner.
 */
function ribbon(w: number, h: number, over: number): Ribbon {
  const out = w + over + 90
  return {
    width: Math.min(190, Math.max(120, h * 0.5)),
    from: [
      [0.76 * w, h + 70],
      [0.8 * w, 0.35 * h],
      [0.97 * w, 0.75 * h],
      [out, -0.25 * h],
    ],
    to: [
      [0.79 * w, h + 70],
      [0.85 * w, 0.2 * h],
      [0.95 * w, 0.95 * h],
      [out, 0.05 * h],
    ],
  }
}

/** Draws the lines into `svg`, which is the column's width in the band, and keeps them moving while it is on screen. Returns what stops it. */
export function runBandLines(svg: SVGSVGElement): () => void {
  const wide = window.matchMedia('(min-width: 901px)')
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
  const count = Math.ceil(24 / EVERY)
  const lines = Array.from({ length: count }, (_, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    line.setAttribute('stroke', tone(i / (count - 1)))
    return line
  })
  svg.append(...lines)

  let shape: Ribbon | null = null
  let onScreen = false
  let frame = 0
  let clock = LOOP * 0.3
  let last = 0

  const draw = () => {
    if (!shape) return
    const d = paths(shape, clock)
    lines.forEach((line, i) => line.setAttribute('d', d[i * EVERY] ?? ''))
  }

  // Thirty frames a second is plenty for a movement this slow.
  const tick = (now: number) => {
    frame = 0
    const step = Math.min(now - last, 100)
    if (step >= 32) {
      clock += step * PACE
      last = now
      draw()
    }
    run()
  }

  const run = () => {
    if (frame === 0 && shape && onScreen && !calm.matches) frame = requestAnimationFrame(tick)
  }

  const measure = () => {
    const box = svg.getBoundingClientRect()
    const band = svg.parentElement?.getBoundingClientRect()
    shape = wide.matches && box.width > 0 ? ribbon(box.width, box.height, Math.max(0, (band?.right ?? box.right) - box.right)) : null
    svg.classList.toggle('on', shape !== null)
    draw()
    run()
  }

  const resized = new ResizeObserver(measure)
  resized.observe(svg)
  // The band can widen while the column stays as it is.
  if (svg.parentElement) resized.observe(svg.parentElement)
  const seen = new IntersectionObserver((entries) => {
    onScreen = entries.at(-1)?.isIntersecting ?? false
    run()
  })
  seen.observe(svg)
  calm.addEventListener('change', run)

  return () => {
    resized.disconnect()
    seen.disconnect()
    calm.removeEventListener('change', run)
    cancelAnimationFrame(frame)
    svg.classList.remove('on')
    for (const line of lines) line.remove()
  }
}
