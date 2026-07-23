import { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IdCard from './IdCard'
import greenBg from '../assets/card_performance/Card Performance.png'

gsap.registerPlugin(ScrollTrigger)

function StatCard({ value, label }) {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col p-[30px] rounded-[20px] relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{
        padding: '1.5px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }} />
      <div className="flex flex-col gap-[6px] text-center w-full">
        <p className="text-white text-[30px] font-light font-['Geist'] leading-[36px] tracking-[-0.6px]">
          {value}
        </p>
        <p className="text-white/80 text-[16px] font-light font-['Geist'] leading-[22px]">
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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        }
      })

      // First nudge
      tl.to(idCardRef.current, { rotation: -1, duration: 0.25, ease: 'power2.out' })
        .to(idCardRef.current, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
        .to(idCardRef.current, { rotation: -4.5, duration: 0.3, ease: 'power2.out' })
        // Pause
        .to(idCardRef.current, { duration: 0.4 })
        // Second nudge
        .to(idCardRef.current, { rotation: -1, duration: 0.25, ease: 'power2.out' })
        .to(idCardRef.current, { rotation: -7, duration: 0.25, ease: 'power2.inOut' })
        .to(idCardRef.current, { rotation: -4.5, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex gap-[20px] isolate items-center p-[70px] rounded-[30px] overflow-visible"
      style={{
        width: '950px',
        backgroundImage: `url(${greenBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left — ID Card */}
      <div className="flex flex-1 items-center self-stretch">
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
      </div>

      {/* Right — Stats */}
      <div className="flex flex-1 gap-[20px] items-start min-w-0 relative z-[1]">
        <StatCard value="55+" label="Projects" />
        <StatCard value="5/5" label="Ratings" />
      </div>
    </div>
  )
}
