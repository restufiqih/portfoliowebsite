import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid, scaleTablet } from '../../utils/fluid'

// Shared between the landing page's closing section and the About page, which
// carry the same contact block in the design.

const FOOTER_LOGO_PATH = 'M20.0665 57.784C2.10027 44.0243 0.802857 18.1984 15.5649 7.41537C29.0348 -2.42381 44.5474 4.62702 46.2629 17.109C47.9783 29.5909 43.0206 38.2324 32.2545 39.6792C21.4883 41.126 22.1779 28.9728 32.2545 28.9728C40.712 28.9728 50.2255 36.549 56.081 40.9898'

const ctaLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/restufiqih/' },
  { label: 'Dribbble', href: 'https://dribbble.com/restufq' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/akhdiyatrestufiqih' },
  { label: 'akhdiyatrestufiqih321@gmail.com', href: 'mailto:akhdiyatrestufiqih321@gmail.com' },
]

function CtaRollingButton({ label, href, mobile }) {
  const [hovered, setHovered] = useState(false)
  const textClass = mobile
    ? "text-white text-[18px] font-light font-['Geist'] leading-[26px] tracking-[0px] whitespace-nowrap block"
    : "text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap block"
  const lineH = mobile ? 26 : 22
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
      <div style={{ height: lineH, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? `translateY(-${lineH}px)` : 'translateY(0px)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <span className={textClass}>{label}</span>
          <span className={textClass}>{label}</span>
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

  return <span>{time} (GMT+7)</span>
}

// The block owns its own frame. Callers used to pass className/style, which is
// how the two pages drifted apart — everything that decides how this looks now
// lives here, and a host section only supplies the background behind it.
export default function ContactFooter({ innerRef }) {
  const { isMobile, isTablet, isMobileView } = useBreakpoint()
  // Tablet holds its 768 figures and grows them with the viewport from there.
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  return (
    <div
      ref={innerRef}
      className="relative z-10 w-full flex flex-col items-center justify-center"
      style={{
        // One rule for every breakpoint: always a viewport tall. minHeight
        // rather than height so a short screen grows instead of clipping the
        // block — on anything that fits, the two are the same thing.
        minHeight: '100vh',
        paddingTop: s(110),
        paddingBottom: s(110),
        paddingLeft: s(20),
        paddingRight: s(20),
        gap: isMobileView ? s(60) : 80,
      }}
    >
      <p
        className="text-white font-light font-['Geist'] text-center"
        style={isMobileView
          ? { fontSize: s(36), lineHeight: sl(42), letterSpacing: 0 }
          : { fontSize: fluid(50, 70), lineHeight: fluid(60, 84), letterSpacing: -4 }
        }
      >
        <>Let&apos;s talk about<br />your next project.</>
      </p>

      {isTablet ? (
        <div className="flex flex-col items-center" style={{ gap: s(10) }}>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: s(10) }}>
            {ctaLinks.filter(l => !l.href.startsWith('mailto:')).map(({ label, href }) => (
              <CtaRollingButton key={label} label={label} href={href} mobile />
            ))}
          </div>
          {ctaLinks.filter(l => l.href.startsWith('mailto:')).map(({ label, href }) => (
            <CtaRollingButton key={label} label={label} href={href} mobile />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-[10px] items-center justify-center">
          {ctaLinks.map(({ label, href }) => (
            <CtaRollingButton key={label} label={label} href={href} mobile={isMobileView} />
          ))}
        </div>
      )}

      <div style={isTablet ? { gap: s(30) } : undefined} className={isTablet
        ? "flex flex-row items-center"
        : isMobile
        ? "flex flex-col gap-[20px] items-center"
        : "flex flex-col sm:flex-row gap-2 sm:gap-[30px] items-center"
      }>
        <div className="flex items-center" style={{ gap: s(10) }}>
          <span className="relative flex shrink-0" style={{ width: s(7), height: s(7) }}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full bg-white" style={{ width: s(7), height: s(7) }} />
          </span>
          <span
            className="text-white font-light font-['Geist'] tracking-[0px]"
            style={{ fontSize: isMobileView ? s(18) : 16, lineHeight: sl(26) }}
          >
            Based in Indonesia
          </span>
        </div>
        <span
          className="text-white font-light font-['Geist'] tracking-[0px]"
          style={{ fontSize: isMobileView ? s(18) : 16, lineHeight: sl(26) }}
        >
          <IndonesiaTime />
        </span>
      </div>

      <FooterLogo />
    </div>
  )
}
