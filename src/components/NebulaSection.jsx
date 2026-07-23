import { useLayoutEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import card1 from '../assets/nebula/card-1.png'
import card2 from '../assets/nebula/card-2.png'
import card3 from '../assets/nebula/card-3.png'
import card4 from '../assets/nebula/card-4.png'
import card5 from '../assets/nebula/card-5.png'
import card6 from '../assets/nebula/card-6.png'
import card7 from '../assets/nebula/card-7.png'
import card8 from '../assets/nebula/card-8.png'
import card9 from '../assets/nebula/card-9.png'
import nebulaIcon from '../assets/nebula/nebula-icon.svg'
import nebulaIconClean from '../assets/nebula/nebula-icon-clean.svg'

gsap.registerPlugin(ScrollTrigger)

const cardImages = [card5, card6, card9, card1, card2, card3, card4, card7, card8]

const CARD_W = 333
const CARD_H = 250
const CARD_SPACING = 360
const ARC_HALF_W = 900
const ARC_DEPTH = 220
const TOTAL_SETS = 3
const TOTAL_CARDS = cardImages.length * TOTAL_SETS
const STRIP_W = cardImages.length * CARD_SPACING

const line1 = ["I'm", 'also', 'building', 'Nebula', 'Studio.']
const line2 = ['A', 'design', 'studio', 'helping', 'brands', 'create', 'digital', 'experiences', 'their', 'users', 'actually', 'love.']

function CharWord({ word, isLast }) {
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {word.split('').map((char, i) => (
        <span
          key={i}
          className="char"
          style={{ display: 'inline-block', color: 'rgba(255,255,255,0.25)' }}
        >
          {char}
        </span>
      ))}
      {!isLast && (
        <span
          className="char"
          style={{ display: 'inline-block', color: 'rgba(255,255,255,0.25)' }}
        >
          {' '}
        </span>
      )}
    </span>
  )
}

export default function NebulaSection() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const logoRef = useRef(null)
  const bottomLogoRef = useRef(null)
  const cardRefs = useRef([])
  const revealRefs = useRef([])
  const progress = useRef(0)
  const [logoHovered, setLogoHovered] = useState(false)
  const tooltipRef = useRef(null)
  const mouseClient = useRef({ x: 0, y: 0 })
  const isInSection = useRef(false)

  const checkInSection = useCallback(() => {
    if (!sectionRef.current || !tooltipRef.current || !bottomLogoRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const bottomLogoRect = bottomLogoRef.current.getBoundingClientRect()
    const { x, y } = mouseClient.current
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y < bottomLogoRect.top
    isInSection.current = inside
    tooltipRef.current.style.opacity = inside ? '1' : '0'
    if (inside) {
      tooltipRef.current.style.left = `${x - rect.left + 16}px`
      tooltipRef.current.style.top = `${y - rect.top + 16}px`
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    mouseClient.current = { x: e.clientX, y: e.clientY }
    checkInSection()
  }, [checkInSection])

  const handleMouseLeave = useCallback(() => {
    isInSection.current = false
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
  }, [])

  useLayoutEffect(() => {
    const onGlobalMove = (e) => {
      mouseClient.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onGlobalMove, { passive: true })
    window.addEventListener('scroll', checkInSection, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onGlobalMove)
      window.removeEventListener('scroll', checkInSection)
    }
  }, [checkInSection])

  const updateCards = useCallback(() => {
    const offset = progress.current * STRIP_W

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const baseX = i * CARD_SPACING
      let x = baseX - offset
      const totalW = STRIP_W * TOTAL_SETS
      x = ((x % totalW) + totalW) % totalW
      x -= STRIP_W * 1.5

      const norm = x / ARC_HALF_W
      const y = -ARC_DEPTH * norm * norm

      const fadeStart = 1.15
      const absDist = Math.abs(x) / ARC_HALF_W
      const opacity = absDist > fadeStart ? Math.max(0, 1 - (absDist - fadeStart) / 0.35) : 1
      const scale = absDist > 1 ? Math.max(0.85, 1 - (absDist - 1) * 0.3) : 1

      const zIndex = Math.round(x + ARC_HALF_W)
      gsap.set(el, { x, y, opacity, scale, zIndex })
    })
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = textRef.current.querySelectorAll('.char')

      gsap.fromTo(
        chars,
        { color: 'rgba(255,255,255,0.25)' },
        {
          color: 'rgba(255,255,255,1)',
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      )

      gsap.fromTo(logoRef.current,
        { y: 100 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: 1,
          },
        }
      )

      gsap.to(sectionRef.current, {
        backgroundColor: '#1602e1',
        ease: 'none',
        scrollTrigger: {
          trigger: bottomLogoRef.current,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
        },
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          progress.current = self.progress * 0.7
          updateCards()
        },
      })

      updateCards()
    }, sectionRef)

    return () => ctx.revert()
  }, [updateCards])

  return (
    <section
      ref={sectionRef}
      style={{ background: '#511ece' }}
      className="relative overflow-hidden flex flex-col items-center pt-[0] pb-[180px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-50 flex items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md px-[14px] py-[6px] text-[14px] font-light font-['Geist'] text-white tracking-[-0.28px] leading-[20px] whitespace-nowrap"
        style={{ opacity: 0 }}
      >
        Click logo to learn more
      </div>

      <p
        ref={textRef}
        className="text-center max-w-[520px] px-4 text-[24px] font-light font-['Geist'] leading-[34px] tracking-[-0.48px]"
      >
        {line1.map((w, i) => (
          <CharWord key={`l1-${i}`} word={w} isLast={false} />
        ))}
        <br />
        {line2.map((w, i) => (
          <CharWord key={`l2-${i}`} word={w} isLast={i === line2.length - 1} />
        ))}
      </p>

      <div className="h-[40px]" />

      <div ref={logoRef} className="relative w-full h-[540px]">
        <a
          href="https://dribbble.com/nebulaonspace"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-1/2 -translate-x-1/2 top-0 z-10 block"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <div className="relative" style={{ width: 222, height: 180 }}>
            <img
              src={nebulaIcon}
              alt="Nebula"
              className="absolute inset-0 w-full h-full transition-opacity duration-300"
              style={{ opacity: logoHovered ? 0 : 1 }}
            />
            <img
              src={nebulaIconClean}
              alt="Nebula"
              className="absolute inset-0 w-full h-full transition-all duration-300"
              style={{
                opacity: logoHovered ? 1 : 1,
                transform: logoHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          </div>
        </a>

        {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute will-change-transform"
            style={{ left: '50%', bottom: 0, marginLeft: -CARD_W / 2 }}
          >
            <div
              ref={(el) => (revealRefs.current[i] = el)}
              className="overflow-hidden rounded-[20px] bg-[#888] will-change-transform"
              style={{ width: CARD_W, height: CARD_H }}
            >
              <img
                src={cardImages[i % cardImages.length]}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={bottomLogoRef}
        className="flex items-center justify-center w-full py-[160px]"
      >
        <img src={nebulaIconClean} alt="Nebula" className="w-[222px] h-[180px]" />
      </div>
    </section>
  )
}
