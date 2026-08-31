import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DrawLogo, NavLink, navLinks, handleNavClick } from './shared'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { scaleTablet } from '../../utils/fluid'
import menuIcon from '../../assets/icons/menu-hamburger.svg'

const HamburgerIcon = ({ color = 'white' }) => (
  <img
    src={menuIcon}
    alt="Menu"
    width={24}
    height={24}
    style={{ filter: color === 'white' ? 'none' : 'brightness(0)' }}
  />
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

function MobileMenu({ open, onClose, isTablet }) {
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)
  const sn = (n) => (isTablet ? `calc(-1 * ${scaleTablet(n)})` : -n)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#1500E1]">
      {/* Nav Items — top padding accounts for navbar header height (~74px) */}
      <div
        className="flex flex-col items-center justify-start"
        style={{
          gap: s(40),
          paddingLeft: isTablet ? s(40) : 16,
          paddingRight: isTablet ? s(40) : 16,
          paddingTop: s(114),
          paddingBottom: s(40),
        }}
      >
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={(e) => { handleNavClick(e, href); onClose() }}
            className="text-white font-light font-['Geist'] text-center w-full cursor-pointer"
            style={{ fontSize: s(20), lineHeight: sl(28), letterSpacing: sn(0.4) }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}

function DesktopNavbar({ stickyVisible }) {
  const navRef = useRef(null)
  const actionsRef = useRef(null)

  useLayoutEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -20, filter: 'blur(10px)' })
    gsap.set(actionsRef.current, { opacity: 0, y: -10, filter: 'blur(8px)' })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(navRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 })
      .to(actionsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, '-=0.3')
  }, [])

  return (
    <>
      <nav ref={navRef} className="absolute top-0 left-0 w-full z-50 bg-transparent py-[30px] px-[50px]">
        <div className="flex justify-between items-center">
          <DrawLogo size={44} color="white" />
          <div ref={actionsRef} className="flex items-center gap-[30px]">
            <div className="flex items-center gap-[10px] h-[44px] py-[6px]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
                Available for Project
              </span>
            </div>
            <NavLink label="Work" href="#works" />
            <NavLink label="Services" href="#services" />
            <NavLink label="KPI's" href="#kpis" />
            <NavLink label="About" href="#/about" />
            <NavLink label="Contact Me" href="#contact" />
          </div>
        </div>
      </nav>

      <nav
        className={`fixed top-0 left-0 w-full z-50 py-0 px-[50px] bg-white transition-transform duration-300 ease-out ${
          stickyVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center">
          <DrawLogo className="w-[44px] h-[44px] origin-left scale-[0.682]" size={44} color="#1500E1" />
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center gap-[10px] h-[44px] py-[6px]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1500E1] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1500E1]" />
              </span>
              <span className="text-black text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
                Available for Project
              </span>
            </div>
            <NavLink label="Work" href="#works" dark />
            <NavLink label="Services" href="#services" dark />
            <NavLink label="KPI's" href="#kpis" dark />
            <NavLink label="About" href="#/about" dark />
            <NavLink label="Contact Me" href="#contact" dark />
          </div>
        </div>
      </nav>
    </>
  )
}

function MobileNavbar({ stickyVisible, menuOpen, onMenuOpen, onMenuClose, isTablet }) {
  const navRef = useRef(null)
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  useLayoutEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -20, filter: 'blur(10px)' })
    gsap.to(navRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, delay: 0.3, ease: 'power3.out' })
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="absolute top-0 left-0 w-full z-[70]"
        style={{ background: 'transparent', paddingTop: s(20), paddingBottom: s(20), paddingLeft: isTablet ? s(40) : 16, paddingRight: isTablet ? s(40) : 16 }}
      >
        <div className="flex items-center justify-between">
          <DrawLogo size={isTablet ? Math.round(34 * 4 / 3) : 34} color="white" />
          <div className="flex items-center" style={{ gap: s(20) }}>
            <div className="flex items-center" style={{ gap: s(10) }}>
              <span className="relative flex shrink-0" style={{ width: s(7), height: s(7) }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full bg-white" style={{ width: s(7), height: s(7) }} />
              </span>
              <span className="text-white font-light font-['Geist'] whitespace-nowrap" style={{ fontSize: s(16), lineHeight: sl(22) }}>
                Available for Project
              </span>
            </div>
            <button
              className="text-white flex items-center justify-center cursor-pointer"
              style={{ height: s(44) }}
              onClick={menuOpen ? onMenuClose : onMenuOpen}
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon color="white" />}
            </button>
          </div>
        </div>
      </nav>

      <nav
        className={`fixed top-0 left-0 w-full z-[70] bg-white transition-transform duration-300 ease-out ${
          stickyVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ paddingTop: s(4), paddingBottom: s(4), paddingLeft: isTablet ? s(40) : 16, paddingRight: isTablet ? s(40) : 16 }}
      >
        <div className="flex items-center justify-between">
          <DrawLogo size={isTablet ? Math.round(30 * 4 / 3) : 30} color="#1500E1" />
          <div className="flex items-center" style={{ gap: s(20) }}>
            {/* Same availability marker the transparent navbar above carries,
                in the brand colour the desktop sticky bar uses against white. */}
            <div className="flex items-center" style={{ gap: s(10) }}>
              <span className="relative flex shrink-0" style={{ width: s(7), height: s(7) }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1500E1] opacity-75" />
                <span className="relative inline-flex rounded-full bg-[#1500E1]" style={{ width: s(7), height: s(7) }} />
              </span>
              <span className="text-black font-light font-['Geist'] whitespace-nowrap" style={{ fontSize: s(16), lineHeight: sl(22) }}>
                Available for Project
              </span>
            </div>
            <button
              className="text-black flex items-center justify-center cursor-pointer"
              style={{ height: s(44) }}
              onClick={menuOpen ? onMenuClose : onMenuOpen}
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon color="black" />}
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={onMenuClose} isTablet={isTablet} />
    </>
  )
}

export default function Navbar() {
  const [stickyVisible, setStickyVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobileView, isTablet } = useBreakpoint()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setStickyVisible(currentY < lastScrollY.current && currentY > 100)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isMobileView ? (
    <MobileNavbar
      stickyVisible={stickyVisible}
      menuOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
      isTablet={isTablet}
    />
  ) : (
    <DesktopNavbar stickyVisible={stickyVisible} />
  )
}
