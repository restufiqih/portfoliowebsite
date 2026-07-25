import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IdCard from './IdCard'
import greenBg from '../assets/card_performance/Card Performance.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

gsap.registerPlugin(ScrollTrigger)

function StatCard({ value, label }) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col p-5 md:p-[30px] rounded-[20px] relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{
        padding: '1.5px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }} />
      <div className="flex flex-col gap-[6px] text-center w-full">
        <p className="text-white text-[22px] md:text-[26px] lg:text-[30px] font-light font-['Geist'] leading-[28px] md:leading-[32px] lg:leading-[36px] tracking-[-0.6px]">
          {value}
        </p>
        <p className="text-white/80 text-[14px] md:text-[16px] font-light font-['Geist'] leading-[20px] md:leading-[22px]">
          {label}
        </p>
      </div>
    </div>
  )
}

export default function CardPerformance() {
  const [hovered, setHovered] = useState(false)
  const cardWrapperRef = useRef(null)
  const idCardRef = useRef(null)
  const containerRef = useRef(null)
  const tooltipRef = useRef(null)
  const { isMobile } = useBreakpoint()

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
    if (isMobile) return
    const ctx = gsap.context(() => {
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
    }, containerRef)
    return () => ctx.revert()
  }, [isMobile])

  return (
    <a
      href="https://www.upwork.com/freelancers/akhdiyatrestufiqih"
      target="_blank"
      rel="noopener noreferrer"
      ref={containerRef}
      className="relative flex flex-col md:flex-row gap-5 isolate items-center p-6 sm:p-8 md:p-12 lg:p-[70px] rounded-[30px] overflow-hidden md:overflow-visible cursor-pointer w-full max-w-[950px]"
      style={{
        backgroundImage: `url(${greenBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-50 flex items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md px-[14px] py-[6px] text-[14px] font-light font-['Geist'] text-white tracking-[-0.28px] leading-[20px] whitespace-nowrap transition-opacity duration-200 hidden md:flex"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        See Upwork Profile
      </div>
      {/* Left — ID Card */}
      <div className="flex flex-1 items-center self-stretch">
        {isMobile ? (
          <div className="w-full flex justify-center">
            <div style={{ width: '100%', maxWidth: '340px', aspectRatio: '463/300' }}>
              <IdCard />
            </div>
          </div>
        ) : (
          <div className="relative flex-1 h-full flex flex-col items-start py-[30px] rounded-[20px] z-[2]">
            <div
              ref={idCardRef}
              className="absolute transition-all duration-300 ease-out"
              style={hovered ? {
                left: '-104.31px',
                top: '-113.54px',
                width: '463px',
                height: '300px',
                transform: 'rotate(0deg)',
              } : {
                left: '-124.13px',
                top: '-117.16px',
                width: '463px',
                height: '300px',
                transform: 'rotate(-4.5deg)',
              }}
            >
              <IdCard />
            </div>
          </div>
        )}
      </div>

      {/* Right — Stats */}
      <div className="flex flex-1 gap-[14px] md:gap-[20px] items-start min-w-0 relative z-[1] w-full md:w-auto">
        <StatCard value="55+" label="Projects" />
        <StatCard value="5/5" label="Ratings" />
      </div>
    </a>
  )
}
