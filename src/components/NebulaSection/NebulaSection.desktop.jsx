import { useLayoutEffect, useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'
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

const TOTAL_SETS = 3
const TOTAL_CARDS = cardImages.length * TOTAL_SETS

function getArcConstants(bp, vw) {
  if (bp !== 'desktop') return { CARD_W: 180, CARD_H: 135, CARD_SPACING: 200, ARC_HALF_W: 500, ARC_DEPTH: 120 }
  const t = Math.min(1, Math.max(0, (vw - 1024) / 416))
  const lerp = (min, max) => min + (max - min) * t
  return {
    CARD_W: lerp(240, 333), CARD_H: lerp(180, 250),
    CARD_SPACING: lerp(260, 360), ARC_HALF_W: lerp(650, 900), ARC_DEPTH: lerp(158, 220),
  }
}

const line1 = ["I'm", 'also', 'building', 'Nebula', 'Studio.']
const line2 = ['A', 'design', 'studio', 'helping', 'brands', 'create', 'digital', 'experiences', 'their', 'users', 'actually', 'love.']

const FOOTER_LOGO_PATH = 'M20.0665 57.784C2.10027 44.0243 0.802857 18.1984 15.5649 7.41537C29.0348 -2.42381 44.5474 4.62702 46.2629 17.109C47.9783 29.5909 43.0206 38.2324 32.2545 39.6792C21.4883 41.126 22.1779 28.9728 32.2545 28.9728C40.712 28.9728 50.2255 36.549 56.081 40.9898'

const ctaLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/restufiqih/' },
  { label: 'Dribbble', href: 'https://dribbble.com/restufq' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/akhdiyatrestufiqih' },
  { label: 'akhdiyatrestufiqih321@gmail.com', href: 'mailto:akhdiyatrestufiqih321@gmail.com' },
]

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

function CtaRollingButton({ label, href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white/20 px-[20px] rounded-[99px] inline-flex justify-center items-center cursor-pointer"
      style={{ height: '50px' }}
    >
      <div style={{ height: '22px', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? 'translateY(-22px)' : 'translateY(0px)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
          <span className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block">{label}</span>
        </div>
      </div>
    </a>
  )
}

function FooterLogo() {
  const pathRef = useRef(null)
  const lengthRef = useRef(0)
  const tweenRef = useRef(null)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    lengthRef.current = path.getTotalLength()
    gsap.set(path, { strokeDasharray: lengthRef.current, strokeDashoffset: 0 })

    const animate = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          tweenRef.current = gsap.delayedCall(4, animate)
        },
      })
      tl.to(path, {
        strokeDashoffset: lengthRef.current,
        duration: 0.8,
        ease: 'power2.in',
      })
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
      tweenRef.current = tl
    }

    tweenRef.current = gsap.delayedCall(3, animate)

    return () => {
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [])

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      className="block"
    >
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path ref={pathRef} d={FOOTER_LOGO_PATH} stroke="white" strokeWidth="5.45455" />
      </svg>
    </a>
  )
}

function IndonesiaTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setTime(formatted)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return <span>{time}</span>
}

export default function NebulaSection() {
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
  const { breakpoint, isMobile, isDesktop } = useBreakpoint()
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const arc = useMemo(() => getArcConstants(breakpoint, vw), [breakpoint, vw])
  const STRIP_W = cardImages.length * arc.CARD_SPACING

  const checkInSection = useCallback(() => {
    if (isMobile || !sectionRef.current || !tooltipRef.current || !ctaRef.current) return
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
      x -= STRIP_W * 1.5

      const norm = x / arc.ARC_HALF_W
      const y = -arc.ARC_DEPTH * norm * norm

      const fadeStart = 1.15
      const absDist = Math.abs(x) / arc.ARC_HALF_W
      const opacity = absDist > fadeStart ? Math.max(0, 1 - (absDist - fadeStart) / 0.35) : 1
      const s = absDist > 1 ? Math.max(0.85, 1 - (absDist - 1) * 0.3) : 1

      const zIndex = Math.round(x + arc.ARC_HALF_W)
      gsap.set(el, { x, y, opacity, scale: s, zIndex })
    })
  }, [arc, STRIP_W])

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
      id="about"
      ref={sectionRef}
      style={{ background: '#511ece' }}
      className="relative overflow-hidden flex flex-col items-center pt-[0]"
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

      <div ref={logoRef} className="relative w-full h-[300px]" style={isDesktop ? { height: fluid(389, 540) } : {}}>
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

      {/* CTA / Contact */}
      <div
        ref={ctaRef}
        className="relative z-10 w-full flex flex-col gap-10 items-center justify-center pt-[100px] pb-[60px] px-5"
        style={{ minHeight: '100vh', ...(isDesktop ? { gap: fluid(58, 80), paddingTop: fluid(216, 300), paddingBottom: fluid(58, 80) } : {}) }}
      >
        <p className="text-white text-[32px] sm:text-[42px] font-light font-['Geist'] tracking-[-1.2px] md:tracking-[-2.8px] text-center" style={isDesktop ? { fontSize: fluid(50, 70), lineHeight: fluid(60, 84) } : {}}>
          Let's talk about
          <br />
          your next project.
        </p>

        <div className="flex flex-wrap gap-[10px] items-center justify-center">
          {ctaLinks.map(({ label, href }) => (
            <CtaRollingButton key={label} label={label} href={href} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-[30px] items-center">
          <div className="flex gap-[10px] items-center">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-white text-[16px] font-light font-['Geist'] leading-[26px] tracking-[-0.36px]">
              Based in Indonesia
            </span>
          </div>
          <span className="text-white text-[16px] font-light font-['Geist'] leading-[26px] tracking-[-0.36px]">
            <IndonesiaTime />
          </span>
        </div>

        <div className="flex flex-col gap-[20px] items-center">
          <FooterLogo />

        </div>
      </div>
    </section>
  )
}
