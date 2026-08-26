import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

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
      href="#"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      onMouseEnter={handleMouseEnter}
      className={`block shrink-0 ${className || ''}`}
    >
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path ref={pathRef} d={LOGO_PATH} stroke={color} strokeWidth="4" />
      </svg>
    </a>
  )
}

export const navLinks = [
  { label: 'Work', href: '#works' },
  { label: 'Services', href: '#services' },
  { label: "KPI's", href: '#kpis' },
  { label: 'About', href: '#about' },
  { label: 'Contact Me', href: '#contact' },
]

export function handleNavClick(e, href) {
  e.preventDefault()
  if (href === '#contact') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(href.replace('#', ''))
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export const NavLink = ({ label, href = '#', dark = false }) => (
  <a
    href={href}
    onClick={(e) => handleNavClick(e, href)}
    className="group relative h-[44px] flex justify-center items-center cursor-pointer"
  >
    <span className={`${dark ? 'text-black' : 'text-white'} text-base font-light font-['Geist'] leading-[22px]`}>
      {label}
    </span>
    <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] ${dark ? 'bg-black' : 'bg-white'} transition-all duration-300 group-hover:w-full`} />
  </a>
)
