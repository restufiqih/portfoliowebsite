import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IdCard from './IdCard'
import greenBg from '../assets/card_performance/Card Performance.png'
import upworkLogo from '../assets/card_performance/upwork-logo.svg'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { fluid, fluidNeg, scaleTablet, scaleTabletNeg } from '../utils/fluid'

gsap.registerPlugin(ScrollTrigger)

function StatCard({ value, label, isDesktop, isMobile }) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col rounded-[20px] relative"
      style={{
        padding: isDesktop ? fluid(22, 30) : isMobile ? 30 : scaleTablet(28),
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.07))',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{
        padding: '1.5px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }} />
      <div className="flex flex-col gap-[6px] text-center w-full">
        <p className="text-white font-light font-['Geist'] tracking-[0px]"
          style={{
            fontSize: isDesktop ? fluid(22, 30) : isMobile ? 30 : scaleTablet(28),
            lineHeight: isDesktop ? fluid(26, 36) : isMobile ? '36px' : scaleTablet(33),
          }}>
          {value}
        </p>
        <p className="text-white/80 font-light font-['Geist']"
          style={{
            fontSize: isDesktop ? fluid(12, 16) : isMobile ? 16 : scaleTablet(15),
            lineHeight: isDesktop ? fluid(16, 22) : isMobile ? '22px' : scaleTablet(20),
          }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function CardPerformance() {
  const [hovered, setHovered] = useState(false)
  const idCardRef = useRef(null)
  const idCardMobileRef = useRef(null)
  const wobbleTimer = useRef(null)
  const containerRef = useRef(null)
  const tooltipRef = useRef(null)
  const { isMobile, isDesktop } = useBreakpoint()
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 375)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mobileCardZoom = vw / 330
  const mobileCardHeight = Math.round(204 * mobileCardZoom)

  const mousePos = useRef({ x: 0, y: 0 })

  const updateTooltip = useCallback(() => {
    if (!tooltipRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    tooltipRef.current.style.left = `${mousePos.current.x - rect.left + 16}px`
    tooltipRef.current.style.top = `${mousePos.current.y - rect.top + 16}px`
  }, [])

  const handleMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    updateTooltip()
  }, [updateTooltip])

  useEffect(() => {
    if (!hovered) return
    window.addEventListener('scroll', updateTooltip, true)
    return () => window.removeEventListener('scroll', updateTooltip, true)
  }, [hovered, updateTooltip])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) {
        const mobileIdCard = idCardMobileRef.current
        if (!mobileIdCard) return
        gsap.set(mobileIdCard, { rotation: -4 })
        const wobble = () => {
          const tl = gsap.timeline({
            onComplete: () => { wobbleTimer.current = setTimeout(wobble, 5000) }
          })
          tl.to(mobileIdCard, { rotation: -1, duration: 0.25, ease: 'power2.out' })
            .to(mobileIdCard, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
            .to(mobileIdCard, { rotation: -4, duration: 0.3, ease: 'power2.out' })
            .to(mobileIdCard, { duration: 0.4 })
            .to(mobileIdCard, { rotation: -1, duration: 0.25, ease: 'power2.out' })
            .to(mobileIdCard, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
            .to(mobileIdCard, { rotation: -4, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
        }
        wobbleTimer.current = setTimeout(wobble, 2000)
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
          }
        })
        tl.to(idCardRef.current, { rotation: -1, duration: 0.25, ease: 'power2.out' })
          .to(idCardRef.current, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
          .to(idCardRef.current, { rotation: -4.5, duration: 0.3, ease: 'power2.out' })
          .to(idCardRef.current, { duration: 0.4 })
          .to(idCardRef.current, { rotation: -1, duration: 0.25, ease: 'power2.out' })
          .to(idCardRef.current, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
          .to(idCardRef.current, { rotation: -4.5, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      }
    }, containerRef)
    return () => {
      if (wobbleTimer.current) clearTimeout(wobbleTimer.current)
      ctx.revert()
    }
  }, [isMobile])

  return (
    <a
      href="https://www.upwork.com/freelancers/akhdiyatrestufiqih"
      target="_blank"
      rel="noopener noreferrer"
      ref={containerRef}
      className={`relative flex ${isMobile ? 'flex-col' : 'flex-row'} isolate items-center overflow-visible cursor-pointer w-full`}
      style={{
        backgroundImage: `url(${greenBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: isDesktop ? fluid(677, 950) : isMobile ? '950px' : scaleTablet(624),
        padding: isDesktop ? fluid(50, 70) : isMobile ? 20 : scaleTablet(28),
        gap: isDesktop ? fluid(14, 20) : isMobile ? 40 : scaleTablet(13),
        borderRadius: isDesktop ? fluid(21, 30) : isMobile ? '30px' : scaleTablet(19),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={tooltipRef}
        className={`pointer-events-none absolute z-50 items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md px-[14px] py-[6px] text-[14px] font-light font-['Geist'] text-white tracking-[0px] leading-[20px] whitespace-nowrap transition-opacity duration-200 ${isMobile ? 'hidden' : 'flex'}`}
        style={{ opacity: hovered ? 1 : 0 }}
      >
        See Upwork Profile
      </div>
      {/* Upwork Logo */}
      <div className={`absolute z-[3] ${isMobile ? 'hidden' : 'flex'} flex-col items-start`} style={{
        top: isDesktop ? fluidNeg(24, 34) : scaleTabletNeg(22),
        right: 0,
        paddingRight: isDesktop ? fluid(23, 32) : scaleTablet(21),
      }}>
        <img src={upworkLogo} alt="Upwork" style={{
          width: isDesktop ? fluid(63, 88) : scaleTablet(58),
          height: isDesktop ? fluid(17, 24) : scaleTablet(16),
        }} />
      </div>

      {/* Left — ID Card */}
      <div className="flex flex-1 items-center self-stretch">
        {isMobile ? (
          <div className="flex justify-center items-center w-full" style={{ height: mobileCardHeight }}>
            <div
              ref={idCardMobileRef}
              style={{ transform: 'rotate(-4deg)', willChange: 'transform' }}
            >
              <div style={{ zoom: mobileCardZoom }}>
                <IdCard />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 h-full flex flex-col items-start py-[30px] rounded-[20px] z-[2]">
            <div
              ref={idCardRef}
              className="absolute transition-all duration-300 ease-out"
              style={hovered ? {
                left: isDesktop ? fluidNeg(74, 104) : scaleTabletNeg(35),
                top: isDesktop ? fluidNeg(81, 114) : scaleTabletNeg(61),
                width: isDesktop ? fluid(330, 463) : scaleTablet(304),
                height: isDesktop ? fluid(214, 300) : scaleTablet(197),
                transform: 'rotate(0deg)',
              } : {
                // Tablet seats the id card differently from desktop: 36 further
                // right, which leaves 30 to the stat card, and 15 lower so its
                // bottom-left corner clears the green card's bottom edge the way
                // desktop's does.
                left: isDesktop ? fluidNeg(88, 124) : scaleTabletNeg(48),
                top: isDesktop ? fluidNeg(83, 117) : scaleTabletNeg(63),
                width: isDesktop ? fluid(330, 463) : scaleTablet(304),
                height: isDesktop ? fluid(214, 300) : scaleTablet(197),
                transform: 'rotate(-4.5deg)',
              }}
            >
              <IdCard />
            </div>
          </div>
        )}
      </div>

      {/* Right — Stats */}
      <div className={`flex flex-1 items-start min-w-0 relative z-[1] ${isMobile ? 'w-full' : 'w-auto'}`} style={{ gap: isDesktop ? fluid(14, 20) : 20 }}>
        <StatCard value="55+" label="Projects" isDesktop={isDesktop} isMobile={isMobile} />
        <StatCard value="5/5" label="Ratings" isDesktop={isDesktop} isMobile={isMobile} />
      </div>
    </a>
  )
}
