import { useLayoutEffect, useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CharWord from '../CharWord'
import ContactFooter from '../ContactFooter'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { TRACK_TEXT, fluid, fluidSpace, fluidType, scaleTablet } from '../../utils/fluid'
import card1 from '../../assets/nebula/card-1.png'
import card2 from '../../assets/nebula/card-2.png'
import card3 from '../../assets/nebula/card-3.png'
import card4 from '../../assets/nebula/card-4.png'
import card5 from '../../assets/nebula/card-5.png'
import card6 from '../../assets/nebula/card-6.png'
import card7 from '../../assets/nebula/card-7.png'
import card8 from '../../assets/nebula/card-8.png'
import card9 from '../../assets/nebula/card-9.png'
import nebulaIcon from '../../assets/nebula/nebula-icon.svg'
import nebulaIconClean from '../../assets/nebula/nebula-icon-clean.svg'

gsap.registerPlugin(ScrollTrigger)

const cardImages = [card5, card6, card9, card1, card2, card3, card4, card7, card8]

const TOTAL_SETS_MOBILE = 5
const TOTAL_SETS_DESKTOP = 7

function getArcConstants(bp, vw) {
  if (bp === 'tablet') return { CARD_W: 240, CARD_H: 180, CARD_SPACING: 260, ARC_HALF_W: 600, ARC_DEPTH: 150 }
  if (bp === 'mobile') return { CARD_W: 180, CARD_H: 135, CARD_SPACING: 200, ARC_HALF_W: 500, ARC_DEPTH: 120 }
  const t = Math.min(1, Math.max(0, (vw - 1024) / 416))
  const lerp = (min, max) => min + (max - min) * t
  return {
    CARD_W: lerp(240, 333), CARD_H: lerp(180, 250),
    CARD_SPACING: lerp(260, 360), ARC_HALF_W: lerp(750, 1050), ARC_DEPTH: lerp(158, 220),
  }
}

const line1 = ["I'm", 'also', 'building', 'Nebula', 'Studio.']
const line2 = ['A', 'design', 'studio', 'helping', 'brands', 'create', 'digital', 'experiences', 'their', 'users', 'actually', 'love.']




export default function Nebula() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const logoRef = useRef(null)
  const ctaRef = useRef(null)
  const cardRefs = useRef([])
  const revealRefs = useRef([])
  const progress = useRef(0)
  const [logoHovered, setLogoHovered] = useState(false)
  const tooltipRef = useRef(null)
  const mouseClient = useRef({ x: 0, y: 0 })
  const isInSection = useRef(false)
  const { breakpoint, isTablet, isMobileView, isDesktop } = useBreakpoint()
  // Tablet holds its 768 figures and grows them with the viewport from there.
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const arc = useMemo(() => getArcConstants(breakpoint, vw), [breakpoint, vw])
  const TOTAL_SETS = breakpoint === 'desktop' ? TOTAL_SETS_DESKTOP : TOTAL_SETS_MOBILE
  const TOTAL_CARDS = cardImages.length * TOTAL_SETS
  const STRIP_W = cardImages.length * arc.CARD_SPACING

  const checkInSection = useCallback(() => {
    if (isMobileView || !sectionRef.current || !tooltipRef.current || !ctaRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const ctaRect = ctaRef.current.getBoundingClientRect()
    const { x, y } = mouseClient.current
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y < ctaRect.top
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
      const baseX = i * arc.CARD_SPACING
      let x = baseX - offset
      const totalW = STRIP_W * TOTAL_SETS
      x = ((x % totalW) + totalW) % totalW
      x -= STRIP_W * (TOTAL_SETS / 2)

      const norm = x / arc.ARC_HALF_W
      const y = -arc.ARC_DEPTH * norm * norm

      const isDesktopArc = breakpoint === 'desktop'
      const fadeStart = isDesktopArc ? 1.4 : 1.15
      const fadeRange = isDesktopArc ? 0.5 : 0.35
      const absDist = Math.abs(x) / arc.ARC_HALF_W
      const opacity = absDist > fadeStart ? Math.max(0, 1 - (absDist - fadeStart) / fadeRange) : 1
      const s = absDist > 1 ? Math.max(isDesktopArc ? 0.8 : 0.85, 1 - (absDist - 1) * (isDesktopArc ? 0.2 : 0.3)) : 1

      const zIndex = Math.round(x + arc.ARC_HALF_W)
      gsap.set(el, { x, y, opacity, scale: s, zIndex })
    })
  }, [arc, STRIP_W, breakpoint, TOTAL_SETS])

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
        { y: isTablet ? 75 : isMobileView ? 50 : 100 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isTablet ? 'top 85%' : isMobileView ? 'top 80%' : 'top 85%',
            end: isTablet ? 'top 15%' : isMobileView ? 'top 20%' : 'bottom 35%',
            scrub: 1,
          },
        }
      )

      gsap.to(sectionRef.current, {
        backgroundColor: '#1602e1',
        ease: 'none',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 40%',
          end: 'top 10%',
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
      className={isMobileView
        ? 'relative overflow-hidden flex flex-col items-center'
        : 'relative overflow-hidden flex flex-col items-center pt-[0]'
      }
      style={isMobileView
        ? { background: '#511ece', paddingTop: 0, paddingLeft: isTablet ? s(40) : 16, paddingRight: isTablet ? s(40) : 16 }
        : { background: '#511ece' }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!isMobileView && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-50 flex items-center justify-center rounded-[99px] bg-white/20 backdrop-blur-md font-light font-['Geist'] text-white whitespace-nowrap"
          style={{
            letterSpacing: TRACK_TEXT,
            opacity: 0,
            paddingLeft: fluidSpace(14), paddingRight: fluidSpace(14),
            paddingTop: fluidSpace(6), paddingBottom: fluidSpace(6),
            ...fluidType(14, 20),
          }}
        >
          Click logo to learn more
        </div>
      )}

      <p
        ref={textRef}
        className={isMobileView
          ? "text-center font-light font-['Geist']"
          : "text-center font-light font-['Geist']"
        }
        style={isDesktop
          ? { letterSpacing: TRACK_TEXT, maxWidth: fluidSpace(520), paddingLeft: fluidSpace(16), paddingRight: fluidSpace(16), ...fluidType(24, 34) }
          : { letterSpacing: TRACK_TEXT, maxWidth: s(520), fontSize: s(24), lineHeight: isTablet ? scaleTablet(34) : '34px' }}
      >
        {line1.map((w, i) => (
          <CharWord key={`l1-${i}`} word={w} isLast={false} charClassName="char" initialColor="rgba(255,255,255,0.25)" />
        ))}
        <br />
        {line2.map((w, i) => (
          <CharWord key={`l2-${i}`} word={w} isLast={i === line2.length - 1} charClassName="char" initialColor="rgba(255,255,255,0.25)" />
        ))}
      </p>

      <div style={{ height: isTablet ? s(120) : isMobileView ? 80 : 40 }} />

      <div ref={logoRef} className="relative w-full" style={isDesktop ? { height: fluid(389, 540) } : { height: s(440) }}>
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
            style={{ left: '50%', bottom: 0, marginLeft: -arc.CARD_W / 2 }}
          >
            <div
              ref={(el) => (revealRefs.current[i] = el)}
              className="overflow-hidden rounded-[12px] bg-[#888] will-change-transform"
              style={{ width: arc.CARD_W, height: arc.CARD_H, ...(isDesktop ? { borderRadius: fluid(14, 20) } : {}) }}
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

      {isMobileView ? <div style={{ height: 100 }} /> : <div style={{ height: 200 }} />}

      {/* CTA / Contact — shared with the About page */}
      <ContactFooter innerRef={ctaRef} />
    </section>
  )
}
