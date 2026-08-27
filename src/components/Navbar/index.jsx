import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DrawLogo, NavLink, navLinks, handleNavClick } from './shared'
import { useBreakpoint } from '../../hooks/useBreakpoint'
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

function MobileMenu({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#1500E1]">
      {/* Nav Items — top padding accounts for navbar header height (~74px) */}
      <div className="flex flex-col items-center justify-start px-[16px] gap-[40px]" style={{ paddingTop: 114, paddingBottom: 40 }}>
        {navLinks.map(({ label, href }, i) => (
          <a
            key={label}
            href={href}
            onClick={(e) => { handleNavClick(e, href); onClose() }}
            className="text-white text-[20px] font-light font-['Geist'] leading-[28px] tracking-[-0.4px] text-center w-full cursor-pointer"
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
            <NavLink label="About" href="#about" />
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
            <NavLink label="About" href="#about" dark />
            <NavLink label="Contact Me" href="#contact" dark />
          </div>
        </div>
      </nav>
    </>
  )
}

function MobileNavbar({ stickyVisible, menuOpen, onMenuOpen, onMenuClose }) {
  const navRef = useRef(null)

  useLayoutEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -20, filter: 'blur(10px)' })
    gsap.to(navRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, delay: 0.3, ease: 'power3.out' })
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="absolute top-0 left-0 w-full z-[70]"
        style={{ background: 'transparent', padding: '20px 16px' }}
      >
        <div className="flex items-center justify-between">
          <DrawLogo size={34} color="white" />
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <span className="relative flex shrink-0" style={{ width: 7, height: 7 }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full bg-white" style={{ width: 7, height: 7 }} />
              </span>
              <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
                Available for Project
              </span>
            </div>
            <button
              className="text-white flex items-center justify-center h-[44px] cursor-pointer"
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
        style={{ padding: '4px 16px' }}
      >
        <div className="flex items-center justify-between">
          <DrawLogo size={30} color="#1500E1" />
          <button
            className="text-black flex items-center justify-center h-[44px] cursor-pointer"
            onClick={menuOpen ? onMenuClose : onMenuOpen}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon color="black" />}
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={onMenuClose} />
    </>
  )
}

export default function Navbar() {
  const [stickyVisible, setStickyVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobileView } = useBreakpoint()
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
    />
  ) : (
    <DesktopNavbar stickyVisible={stickyVisible} />
  )
}
