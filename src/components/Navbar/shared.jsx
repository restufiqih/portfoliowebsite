import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { navigate } from '../../utils/route'
import { fluid } from '../../utils/fluid'

const LOGO_PATH = 'M14.7154 42.3748C1.54019 32.2843 0.588755 13.3454 11.4143 5.4378C21.2922 -1.7776 32.6681 3.39301 33.9261 12.5464C35.1841 21.6999 31.5484 28.0369 23.6533 29.0979C15.7581 30.1589 16.2638 21.2466 23.6533 21.2466C29.8555 21.2466 36.832 26.8025 41.1261 30.0591'

export function DrawLogo({ size = 44, color = 'white', className }) {
  const pathRef = useRef(null)
  const lengthRef = useRef(0)
  const tweenRef = useRef(null)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    lengthRef.current = path.getTotalLength()
    gsap.set(path, { strokeDasharray: lengthRef.current, strokeDashoffset: lengthRef.current })
    gsap.to(path, { strokeDashoffset: 0, duration: 1.2, delay: 0.7, ease: 'power2.out' })
  }, [])

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.kill()
    const tl = gsap.timeline()
    tl.to(pathRef.current, { strokeDashoffset: lengthRef.current, duration: 0.6, ease: 'power2.in' })
      .to(pathRef.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' })
    tweenRef.current = tl
  }

  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault()
        const wasAway = window.location.pathname !== '/'
        navigate('/')
        // Gliding only makes sense when we were already on this page; coming
        // back from another one starts at the top anyway.
        window.scrollTo({ top: 0, behavior: wasAway ? 'auto' : 'smooth' })
      }}
      onMouseEnter={handleMouseEnter}
      className={`block shrink-0 ${className || ''}`}
    >
      {/* Sized in CSS, not with the width/height attributes: `size` can be a
          clamp() on desktop, which an SVG attribute will not accept. */}
      <svg
        style={{ width: size, height: size, display: 'block' }}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path ref={pathRef} d={LOGO_PATH} stroke={color} strokeWidth="4" />
      </svg>
    </a>
  )
}

export const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '#services' },
  { label: "KPI's", href: '#kpis' },
  // A route rather than an anchor: hrefs starting with '/' switch pages.
  { label: 'About', href: '/about' },
  { label: 'Contact Me', href: '#contact' },
]

export function handleNavClick(e, href) {
  e.preventDefault()

  // Route links move between pages and always land at the top.
  if (href.startsWith('/')) {
    navigate(href)
    window.scrollTo({ top: 0, behavior: 'auto' })
    return
  }

  if (href === '#contact') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    return
  }

  const el = document.getElementById(href.replace('#', ''))
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    return
  }

  // Section is on the landing page and we are not on it — go home first, then
  // scroll once the section has actually mounted. The scroll is deferred two
  // more frames past that: switching routes resets the scroll position, and
  // starting before that lands would just be undone.
  navigate('/')
  const id = href.replace('#', '')
  let tries = 0
  // Timers rather than animation frames: a backgrounded tab stops painting and
  // would leave the pending scroll queued forever.
  const settle = () => {
    const target = document.getElementById(id)
    if (!target) {
      if (tries++ < 60) setTimeout(settle, 16)
      return
    }
    // Jump rather than glide: the route change has already snapped the
    // viewport to the top, and easing several thousand pixels from there
    // reads as a stall, not as motion.
    setTimeout(() => target.scrollIntoView({ behavior: 'auto' }), 32)
  }
  setTimeout(settle, 16)
}

// Desktop only -- the mobile menu draws its own links. `height` and the type
// both ride the 1024->1440 ramp, so the bar keeps step with the sections below.
export const NavLink = ({ label, href = '#', dark = false, height = 44 }) => (
  <a
    href={href}
    onClick={(e) => handleNavClick(e, href)}
    className="group relative flex justify-center items-center cursor-pointer"
    style={{ height }}
  >
    <span
      className={`${dark ? 'text-black' : 'text-white'} font-light font-['Geist']`}
      style={{ fontSize: fluid(14, 16), lineHeight: fluid(18, 22) }}
    >
      {label}
    </span>
    <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] ${dark ? 'bg-black' : 'bg-white'} transition-all duration-300 group-hover:w-full`} />
  </a>
)
