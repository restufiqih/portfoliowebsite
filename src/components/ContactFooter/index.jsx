import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { TRACK_DISPLAY, TRACK_TEXT, fluid, fluidSpace, fluidType, scaleTablet } from '../../utils/fluid'

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
    ? "text-white text-[18px] font-light font-['Geist'] leading-[26px] whitespace-nowrap block"
    : "text-white font-light font-['Geist'] whitespace-nowrap block"
  // Desktop rides the ramp; the roll travels exactly one line, so the transform
  // is written against the same value with calc() rather than a fixed px.
  // Geist/16 is the one step the design file leaves untracked.
  const desktopType = fluidType(16, 22)
  const mobileType = { letterSpacing: TRACK_TEXT }
  const lineH = mobile ? '26px' : desktopType.lineHeight
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white/20 rounded-[99px] inline-flex justify-center items-center cursor-pointer"
      style={{
        height: mobile ? '50px' : fluidSpace(50),
        paddingLeft: mobile ? 20 : fluidSpace(20),
        paddingRight: mobile ? 20 : fluidSpace(20),
      }}
    >
      <div style={{ height: lineH, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          transform: hovered ? `translateY(calc(-1 * ${lineH}))` : 'translateY(0px)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <span className={textClass} style={mobile ? mobileType : desktopType}>{label}</span>
          <span className={textClass} style={mobile ? mobileType : desktopType}>{label}</span>
        </div>
      </div>
    </a>
  )
}

function FooterLogo({ size = 60 }) {
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
      <svg style={{ width: size, height: size, display: 'block' }} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  // Desktop rides the 1024->1440 ramp; the other two keep what they had.
  const isDesktop = !isMobileView
  const sp = (n) => (isDesktop ? fluidSpace(n) : s(n))

  return (
    <div
      ref={innerRef}
      className="relative z-10 w-full flex flex-col items-center justify-center"
      style={{
        // One rule for every breakpoint: always a viewport tall. minHeight
        // rather than height so a short screen grows instead of clipping the
        // block — on anything that fits, the two are the same thing.
        minHeight: '100vh',
        paddingTop: sp(110),
        paddingBottom: sp(110),
        // Desktop keeps its side inset; mobile and tablet run edge to edge, so
        // the block centres on the full width rather than a 20px-narrower one.
        paddingLeft: isDesktop ? fluidSpace(20) : 0,
        paddingRight: isDesktop ? fluidSpace(20) : 0,
        gap: isMobileView ? s(60) : fluidSpace(80),
      }}
    >
      <p
        className="text-white font-light font-['Geist'] text-center"
        style={isMobileView
          ? { fontSize: s(36), lineHeight: sl(42), letterSpacing: TRACK_DISPLAY }
          : { fontSize: fluid(50, 70), lineHeight: fluid(60, 84), letterSpacing: TRACK_DISPLAY }
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
        <div className="flex flex-wrap items-center justify-center" style={{ gap: sp(10) }}>
          {ctaLinks.map(({ label, href }) => (
            <CtaRollingButton key={label} label={label} href={href} mobile={isMobileView} />
          ))}
        </div>
      )}

      <div style={isTablet ? { gap: s(30) } : isDesktop ? { gap: fluidSpace(30) } : undefined} className={isTablet
        ? "flex flex-row items-center"
        : isMobile
        ? "flex flex-col gap-[20px] items-center"
        : "flex flex-col sm:flex-row gap-2 items-center"
      }>
        <div className="flex items-center" style={{ gap: sp(10) }}>
          <span className="relative flex shrink-0" style={{ width: s(7), height: s(7) }}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full bg-white" style={{ width: s(7), height: s(7) }} />
          </span>
          <span
            className="text-white font-light font-['Geist']"
            style={isDesktop ? fluidType(16, 22) : { fontSize: s(18), lineHeight: sl(26), letterSpacing: TRACK_TEXT }}
          >
            Based in Indonesia
          </span>
        </div>
        <span
          className="text-white font-light font-['Geist']"
          style={isDesktop ? fluidType(16, 22) : { fontSize: s(18), lineHeight: sl(26), letterSpacing: TRACK_TEXT }}
        >
          <IndonesiaTime />
        </span>
      </div>

      <FooterLogo size={sp(60)} />
    </div>
  )
}
