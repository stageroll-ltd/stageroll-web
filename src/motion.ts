import { useEffect } from 'react'

// The hero's load choreography: CSS animations keyed off html.loaded, added a
// frame after mount so the first paint is the starting state. Reduced motion
// gets the finished hero straight away. index.html marks the root `js` before
// paint, so the hidden-until-animated rules never apply without script.
export function useMotion() {
  useEffect(() => {
    const html = document.documentElement
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      html.classList.add('still')
      return () => html.classList.remove('still')
    }
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => html.classList.add('loaded'))
    })
    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('loaded')
    }
  }, [])
}
