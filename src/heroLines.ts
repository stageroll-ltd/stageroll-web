// The lines in the home page's hero (Home.tsx): a ribbon of fine lines in the
// sunset colours that comes in at the bottom left, runs under the buttons and
// climbs away to the top right. It twists as it goes; the twist travels along
// it while its path swings out and back, one round every minute and a half.
// The lines are not evenly spaced: they gather a little towards one side
// of the ribbon and open on the other, and where they gather drifts slowly
// across it and along it.
// When the page loads the ribbon opens: it starts from edge to edge as a
// single line with no colour, and its lines spread out from that to their
// full breadth as the colour comes in.
//
// The ribbon is fitted to the hero whenever the hero changes size, so the
// lines never cross a line of text or a button: the climb moves right, the
// run sinks lower and the ribbon narrows until it is clear. Where nothing
// fits the hero has no lines. On a phone the words fill the width, so the
// drawing is a band of its own above them (home.css) with nothing in it to
// keep clear of, and the ribbon crosses it whole. Reduced motion gets them still.
// A mouse moving over them pushes the lines near it gently the way it is
// going, and they give way slowly, as if in something thick: a quick pass
// barely moves them, a steady one drags them along, and they take a second
// or two to settle back when it stops.

/** A box to keep clear of, in the hero's own pixels. */
export type Box = { x0: number; y0: number; x1: number; y1: number }

type Pt = readonly [number, number]
/** A cubic curve: where it starts, its two handles, where it ends. */
type Curve = readonly [Pt, Pt, Pt, Pt]

/** The ribbon's path swings between two curves; `width` is its widest, flat on. */
export type Ribbon = { from: Curve; to: Curve; width: number }

const LINES = 24
/** Points along each line; the path between them is smoothed. */
const STEPS = 40
/** One round, in milliseconds: the twist travels the ribbon and the path swings out and back. */
export const LOOP = 90_000
/** The twist, in radians, where the ribbon starts and where it ends. */
const TWIST_FROM = 0.6
const TWIST_TO = 5.9
/** How far the ribbon bows across its width, as a share of the width. */
const BOW = 0.22
/** The lines come no nearer than this to a word or a button. */
const CLEAR = 14
/** The pointer moves the lines within this many pixels of it. */
const REACH = 180
/**
 * How far the lines under a moving pointer are pushed, in pixels, at most.
 * Less than CLEAR, so a line pushed towards the words still stops short.
 */
const PUSH = 11
/** The push follows the pointer this far behind, in milliseconds: the softness of it. */
const PUSH_LAG = 150
/** A pointer trailing its mark by this many pixels pushes at full strength. */
const PUSH_FULL = 70
/**
 * How slowly each point of a line gives way to the push, and settles back
 * after it, in milliseconds: the thickness of what the lines move through.
 */
const PUSH_THICK = 600
/** How long the ribbon takes to open when the page loads, in milliseconds. */
const OPENING = 2000
/**
 * How much the lines gather: 0 is evenly spaced; at 0.25 the gaps run from
 * 0.75 to 1.25 of even. Below 1 the lines can never cross.
 */
const GATHER = 0.25
/** How long the gathering takes to drift once across the ribbon, in milliseconds. */
const GATHER_LOOP = 40_000
/** How many times the gathering crosses the ribbon between its two ends. */
const GATHER_ALONG = 1.3

// The sunset, as home.css has it (--hm-deep, --hm-mid, --hm-top, --hm-glow):
// the first line is the deepest and the last the brightest.
const SUNSET = [
  [0x93, 0x20, 0x4a],
  [0xc4, 0x2a, 0x60],
  [0xe2, 0x36, 0x6e],
  [0xff, 0x8f, 0x45],
] as const

function colour(t: number): string {
  const at = Math.min(t, 0.9999) * (SUNSET.length - 1)
  const a = SUNSET[Math.floor(at)] ?? SUNSET[0]
  const b = SUNSET[Math.floor(at) + 1] ?? a
  const mix = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * (at % 1))
  return `rgb(${mix(0)} ${mix(1)} ${mix(2)})`
}

function point([a, b, c, d]: Curve, s: number): Pt {
  const r = 1 - s
  const ka = r * r * r
  const kb = 3 * r * r * s
  const kc = 3 * r * s * s
  const kd = s * s * s
  return [ka * a[0] + kb * b[0] + kc * c[0] + kd * d[0], ka * a[1] + kb * b[1] + kc * c[1] + kd * d[1]]
}

/** The unit normal to the curve at `s`: the way across the ribbon. */
function across([a, b, c, d]: Curve, s: number): Pt {
  const r = 1 - s
  const ka = 3 * r * r
  const kb = 6 * r * s
  const kc = 3 * s * s
  const dx = ka * (b[0] - a[0]) + kb * (c[0] - b[0]) + kc * (d[0] - c[0])
  const dy = ka * (b[1] - a[1]) + kb * (c[1] - b[1]) + kc * (d[1] - c[1])
  const n = Math.hypot(dx, dy) || 1
  return [-dy / n, dx / n]
}

function between(p: Curve, q: Curve, e: number): Curve {
  const mix = (a: Pt, b: Pt): Pt => [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e]
  return [mix(p[0], q[0]), mix(p[1], q[1]), mix(p[2], q[2]), mix(p[3], q[3])]
}

/** The ribbon is narrower at its ends than in the middle. */
const breadth = (width: number, s: number) => width * (0.6 + 0.4 * Math.sin(Math.PI * s))

/**
 * The ribbon for a hero `w` by `h`. At `push` 0 it is the shape as designed: in
 * at the bottom left, along the foot, then a long diagonal to the top right.
 * As `push` goes to 1 the climb moves to the right edge and swings less,
 * making room for wider words. `drop` sinks the run along the foot.
 */
function ribbon(w: number, h: number, push: number, drop: number, width: number): Ribbon {
  const x1 = (0.5 + 0.36 * push) * w
  const y1 = h + 46 + 14 * push + drop
  const x2 = (0.619 + 0.351 * push) * w
  const y2 = (0.549 + 0.171 * push) * h
  const swing = 1 - 0.6 * push
  return {
    width,
    from: [
      [-90, h + 8 + drop],
      [x1, y1],
      [x2, y2],
      [w + 90, -0.03 * h],
    ],
    to: [
      [-90, h - 2 + drop],
      [x1 + 0.048 * w * swing, y1 + 25 * swing],
      [x2 + 0.042 * w * swing, y2 - 0.101 * h * swing],
      [w + 90, (-0.03 + 0.16 * swing) * h],
    ],
  }
}

/**
 * Whether the ribbon keeps out of every box, wherever it is in its round:
 * the whole band it can sweep is checked, not one moment of it.
 */
function clears(r: Ribbon, boxes: Box[]): boolean {
  for (let j = 0; j <= 8; j++) {
    const curve = between(r.from, r.to, j / 8)
    for (let k = 0; k <= 96; k++) {
      const s = k / 96
      const [x, y] = point(curve, s)
      const [nx, ny] = across(curve, s)
      const reach = breadth(r.width, s) / 2 + 0.17 * BOW * r.width
      for (let m = -4; m <= 4; m++) {
        const px = x + (nx * reach * m) / 4
        const py = y + (ny * reach * m) / 4
        if (boxes.some((b) => px > b.x0 && px < b.x1 && py > b.y0 && py < b.y1)) return false
      }
    }
  }
  return true
}

/**
 * The ribbon that fits a hero `w` by `h` with these words in it: as near the
 * designed shape as keeps clear of them, or null where none does.
 */
export function fit(w: number, h: number, words: Box[]): Ribbon | null {
  const boxes = words.map((b) => ({ x0: b.x0 - CLEAR, y0: b.y0 - CLEAR, x1: b.x1 + CLEAR, y1: b.y1 + CLEAR }))
  const width = Math.min(250, Math.max(150, w / 8))
  for (const scale of [1, 0.85, 0.7]) {
    for (const drop of [0, 16, 32, 48]) {
      for (let push = 0; push <= 1; push += 0.125) {
        const r = ribbon(w, h, push, drop, width * scale)
        if (clears(r, boxes)) return r
      }
    }
  }
  return null
}

const round = (v: number) => Math.round(v * 10) / 10

/** Where the pointer's push is centred, and the push there, in pixels each way. */
export type Poke = {
  x: number
  y: number
  dx: number
  dy: number
  /**
   * What every point of every line is holding of the push so far (x and y,
   * line by line at each step along the ribbon). With it, a point does not
   * jump to where the push would put it: it moves `give` of the way there
   * each time the lines are drawn, and as slowly back.
   */
  held?: Float32Array
  /** How much of the way a point moves in this drawing, from 0 (it stays) to 1 (all of it). */
  give?: number
  /** Set by `paths`: whether any point is still out of its place. */
  live?: boolean
}

/**
 * The ribbon's lines `ms` into its round, each as a path's `d`. `open` is how
 * far the ribbon has opened: at 0 every line lies along its middle, at 1 they
 * are spread to its full breadth. With a `poke`, the lines near it are moved
 * the way it pushes, all together, most at its centre and fading out round it.
 */
export function paths(r: Ribbon, ms: number, open = 1, poke?: Poke): string[] {
  const turn = (ms % LOOP) / LOOP
  const curve = between(r.from, r.to, (1 - Math.cos(2 * Math.PI * turn)) / 2)
  const phase = -4 * Math.PI * turn
  const out: string[] = Array.from({ length: LINES }, () => '')
  // Each line is drawn through the middles of its points, with the points as
  // handles, so it bends smoothly however few there are.
  let before: number[] = []
  let moving = false
  for (let k = 0; k <= STEPS; k++) {
    const s = k / STEPS
    const [x, y] = point(curve, s)
    const [nx, ny] = across(curve, s)
    const angle = TWIST_FROM + (TWIST_TO - TWIST_FROM) * s + phase
    const flat = open * breadth(r.width, s) * Math.cos(angle)
    const bow = open * BOW * r.width * Math.sin(angle * 0.5 + 1)
    // Where the lines gather, here and now. Each line's place across the
    // ribbon is nudged by a wave one ribbon wide; the two edge lines stay
    // put, so the ribbon is no wider than the fit allowed for.
    const gather = 2 * Math.PI * (ms / GATHER_LOOP + GATHER_ALONG * s)
    const edge = Math.sin(gather)
    const here: number[] = []
    for (let i = 0; i < LINES; i++) {
      const even = i / (LINES - 1)
      const t = even - 0.5 + (GATHER / (2 * Math.PI)) * (Math.sin(2 * Math.PI * even + gather) - edge)
      const d = t * flat + (t * t - 0.08) * bow
      let px = x + nx * d
      let py = y + ny * d
      if (poke) {
        // Where the push would put this point, were it free to go at once.
        let wx = 0
        let wy = 0
        if (poke.dx !== 0 || poke.dy !== 0) {
          const far = Math.hypot(px - poke.x, py - poke.y) / REACH
          if (far < 1) {
            const near = (1 - far * far) ** 2
            wx = poke.dx * near
            wy = poke.dy * near
          }
        }
        if (poke.held) {
          const at = (k * LINES + i) * 2
          const give = poke.give ?? 1
          const hx = poke.held[at] ?? 0
          const hy = poke.held[at + 1] ?? 0
          wx = hx + (wx - hx) * give
          wy = hy + (wy - hy) * give
          poke.held[at] = wx
          poke.held[at + 1] = wy
          if (Math.abs(wx) > 0.05 || Math.abs(wy) > 0.05) moving = true
        }
        px += wx
        py += wy
      }
      here.push(px, py)
      if (k === 0) {
        out[i] = `M${round(px)} ${round(py)}`
      } else {
        const bx = before[i * 2] ?? px
        const by = before[i * 2 + 1] ?? py
        const end = k === STEPS ? `${round(px)} ${round(py)}` : `${round((bx + px) / 2)} ${round((by + py) / 2)}`
        out[i] += k === 1 ? `L${end}` : `Q${round(bx)} ${round(by)} ${end}`
      }
    }
    before = here
  }
  if (poke) poke.live = moving
  return out
}

/** Every line of text and every link inside `stage`, as boxes measured from `origin`'s corner. */
function wordsIn(stage: Element, origin: DOMRect): Box[] {
  const rects: DOMRect[] = []
  const range = document.createRange()
  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue?.trim()) continue
    range.selectNodeContents(node)
    rects.push(...range.getClientRects())
  }
  for (const link of stage.querySelectorAll('a')) rects.push(link.getBoundingClientRect())
  return rects
    .filter((r) => r.width > 0 && r.height > 0)
    .map((r) => ({ x0: r.left - origin.left, y0: r.top - origin.top, x1: r.right - origin.left, y1: r.bottom - origin.top }))
}

/** Slow to start, slow to settle. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2)

/**
 * Draws the lines into `svg`, which fills the hero behind its words, and keeps
 * them moving while the hero is on screen. Returns what stops it.
 */
export function runHeroLines(svg: SVGSVGElement): () => void {
  const stage = svg.parentElement
  if (!stage) return () => {}
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)')

  const lines = Array.from({ length: LINES }, (_, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    line.setAttribute('stroke', colour(i / (LINES - 1)))
    return line
  })
  svg.append(...lines)

  let shape: Ribbon | null = null
  let onScreen = true
  let frame = 0
  /** How far into its round the ribbon is; it only counts while the lines move. */
  let clock = 0
  let last = 0
  /** How long the ribbon has been opening; with motion reduced it is open from the start. */
  let opened = calm.matches ? OPENING : 0

  // The pointer, for a mouse over the hero. A mark follows the mouse a little
  // behind it, and the lines round the mark are pushed the way the mouse is
  // heading, harder the faster it goes. They do not go at once: each point
  // holds what it has of the push (`held`) and gives way slowly, so the
  // lines move as if through something thick. When the mouse stops the mark
  // catches up and they settle back as slowly, so nothing jumps and nothing
  // stays bent.
  const poke: Poke = { x: 0, y: 0, dx: 0, dy: 0, held: new Float32Array(LINES * (STEPS + 1) * 2), give: 0, live: false }
  let aim: { x: number; y: number } | null = null

  // While the ribbon opens its colour comes in with it: closed, the lines
  // lie on top of one another and would be one heavy stroke at full colour.
  const draw = () => {
    if (!shape) return
    const t = opened / OPENING
    const d = paths(shape, clock, ease(t), poke)
    lines.forEach((line, i) => line.setAttribute('d', d[i] ?? ''))
    svg.style.opacity = t < 1 ? String(Math.round(t * t * (3 - 2 * t) * 1000) / 1000) : ''
  }

  // While the ribbon opens it is redrawn every frame; after that thirty
  // frames a second is plenty for a movement this slow.
  const tick = (now: number) => {
    frame = 0
    const step = Math.min(now - last, 100)
    // With the pointer at work the lines are redrawn every frame as well.
    // (a mouse at rest over the hero costs nothing extra).
    const pushing =
      poke.live === true || poke.dx !== 0 || poke.dy !== 0 || (aim !== null && Math.hypot(aim.x - poke.x, aim.y - poke.y) > 0.3)
    if (opened < OPENING || step >= 32 || pushing) {
      clock += step
      opened = Math.min(OPENING, opened + step)
      last = now
      if (aim) {
        const follow = 1 - Math.exp(-step / PUSH_LAG)
        poke.x += (aim.x - poke.x) * follow
        poke.y += (aim.y - poke.y) * follow
        // What is left between the mark and the mouse is the push.
        const gapX = aim.x - poke.x
        const gapY = aim.y - poke.y
        const gap = Math.hypot(gapX, gapY)
        const size = gap < 0.3 ? 0 : (PUSH * Math.min(1, gap / PUSH_FULL)) / gap
        poke.dx = gapX * size
        poke.dy = gapY * size
      } else {
        // The mouse has gone: what push is left dies away.
        const fade = Math.exp(-step / PUSH_LAG)
        poke.dx = Math.abs(poke.dx) < 0.05 ? 0 : poke.dx * fade
        poke.dy = Math.abs(poke.dy) < 0.05 ? 0 : poke.dy * fade
      }
      // Only a drawing that time has passed for lets the points move; one made for a new size does not.
      poke.give = 1 - Math.exp(-step / PUSH_THICK)
      draw()
      poke.give = 0
    }
    run()
  }

  const run = () => {
    if (frame === 0 && shape && onScreen && !calm.matches) frame = requestAnimationFrame(tick)
  }

  const measure = () => {
    const box = svg.getBoundingClientRect()
    // Only the words the drawing lies behind count: where it is a band above them all, none do.
    const words = wordsIn(stage, box).filter((word) => word.y1 > 0 && word.y0 < box.height)
    shape = box.width > 0 ? fit(box.width, box.height, words) : null
    svg.classList.toggle('on', shape !== null)
    draw()
    run()
  }

  const moved = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const box = svg.getBoundingClientRect()
    const at = { x: e.clientX - box.left, y: e.clientY - box.top }
    // Arriving, the mark starts where the mouse is, not where it last was.
    if (!aim) Object.assign(poke, at)
    aim = at
  }
  const left = () => {
    aim = null
  }
  stage.addEventListener('pointermove', moved)
  stage.addEventListener('pointerleave', left)

  const resized = new ResizeObserver(measure)
  resized.observe(stage)
  const seen = new IntersectionObserver((entries) => {
    onScreen = entries.at(-1)?.isIntersecting ?? true
    run()
  })
  seen.observe(svg)
  calm.addEventListener('change', run)

  return () => {
    resized.disconnect()
    seen.disconnect()
    calm.removeEventListener('change', run)
    stage.removeEventListener('pointermove', moved)
    stage.removeEventListener('pointerleave', left)
    cancelAnimationFrame(frame)
    svg.classList.remove('on')
    svg.style.opacity = ''
    for (const line of lines) line.remove()
  }
}
