import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DrawLogo, NavLink } from './shared'

export default function NavbarDesktop({ stickyVisible }) {
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
      {/* Static */}
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

      {/* Sticky */}
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
