import { useState, useEffect, useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import NavbarDesktop from './Navbar.desktop'
import NavbarMobile from './Navbar.mobile'

export default function Navbar() {
  const [stickyVisible, setStickyVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDesktop } = useBreakpoint()
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

  return isDesktop ? (
    <NavbarDesktop stickyVisible={stickyVisible} />
  ) : (
    <NavbarMobile
      stickyVisible={stickyVisible}
      menuOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  )
}
