import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import navbarLogo from '../assets/navbar-logo.svg'

const LOGO_PATH = 'M14.7154 42.3748C1.54019 32.2843 0.588755 13.3454 11.4143 5.4378C21.2922 -1.7776 32.6681 3.39301 33.9261 12.5464C35.1841 21.6999 31.5484 28.0369 23.6533 29.0979C15.7581 30.1589 16.2638 21.2466 23.6533 21.2466C29.8555 21.2466 36.832 26.8025 41.1261 30.0591'

function DrawLogo({ className, color = 'white' }) {
  const pathRef = useRef(null)
  const lengthRef = useRef(0)
  const tweenRef = useRef(null)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    lengthRef.current = path.getTotalLength()
    gsap.set(path, { strokeDasharray: lengthRef.current, strokeDashoffset: lengthRef.current })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      delay: 0.7,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.kill()
    const tl = gsap.timeline()
    tl.to(pathRef.current, {
      strokeDashoffset: lengthRef.current,
      duration: 0.6,
      ease: 'power2.in',
    })
    .to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
    tweenRef.current = tl
  }

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      onMouseEnter={handleMouseEnter}
      className="block"
    >
      <svg className={className} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={pathRef}
          d={LOGO_PATH}
          stroke={color}
          strokeWidth="4"
        />
      </svg>
    </a>
  )
}

const NavLink = ({ label, href = "#", dark = false }) => (
  <a
    href={href}
    className="group relative h-[44px] flex justify-center items-center cursor-pointer transition-all duration-300"
  >
    <span className={`${dark ? 'text-black' : 'text-white'} text-base font-light font-['Geist'] leading-[22px]`}>
      {label}
    </span>
    <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] ${dark ? 'bg-black' : 'bg-white'} transition-all duration-300 group-hover:w-full`}></span>
  </a>
)

export default function Navbar() {
  const [stickyVisible, setStickyVisible] = useState(false)
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const actionsRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < lastScrollY.current && currentY > 100) {
        setStickyVisible(true)
      } else {
        setStickyVisible(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useLayoutEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -20, filter: 'blur(10px)' })
    gsap.set(actionsRef.current, { opacity: 0, y: -10, filter: 'blur(8px)' })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(navRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 })
      .to(actionsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, '-=0.3')
  }, [])

  return (
    <>
      {/* Static navbar */}
      <nav
        ref={navRef}
        className="absolute top-0 left-0 w-full z-50 py-[30px] px-[50px] bg-transparent"
      >
        <div className="flex justify-between items-center">
          <div ref={logoRef}>
            <DrawLogo className="w-[44px] h-[44px]" color="white" />
          </div>
          <div ref={actionsRef} className="hidden md:flex items-center gap-[30px]">
            <div className="flex items-center gap-[10px] h-[44px] py-[6px]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
                Available for Project
              </span>
            </div>
            <NavLink label="Work" href="#works" />
            <NavLink label="Services" href="#services" />
            <NavLink label="KPI's" href="#kpis" />
            <NavLink label="Contact Me" href="#contact" />
          </div>
        </div>
      </nav>

      {/* Sticky navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 py-0 px-[50px] bg-white transition-transform duration-300 ease-out ${
          stickyVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center">
          <DrawLogo className="w-[44px] h-[44px] origin-left scale-[0.682]" color="#1500E1" />
          <div className="hidden md:flex items-center gap-[30px]">
            <div className="flex items-center gap-[10px] h-[44px] py-[6px]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1500E1] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1500E1]"></span>
              </span>
              <span className="text-black text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
                Available for Project
              </span>
            </div>
            <NavLink label="Work" href="#works" dark />
            <NavLink label="Services" href="#services" dark />
            <NavLink label="KPI's" href="#kpis" dark />
            <NavLink label="Contact Me" href="#contact" dark />
          </div>
        </div>
      </nav>
    </>
  )
}
