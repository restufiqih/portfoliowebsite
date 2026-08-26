import { useState, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function getBreakpoint(w) {
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint() {
  const [bp, setBp] = useState(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'desktop'
  )

  useEffect(() => {
    let timeout
    const onResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const next = getBreakpoint(window.innerWidth)
        setBp((prev) => {
          if (prev !== next) {
            ScrollTrigger.refresh()
            return next
          }
          return prev
        })
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    breakpoint: bp,
    isMobile: bp === 'mobile',
    isTablet: bp === 'tablet',
    isDesktop: bp === 'desktop',
    isMobileView: bp !== 'desktop',
    scale: bp === 'mobile' ? 0.4 : bp === 'tablet' ? 0.7 : 1,
  }
}
