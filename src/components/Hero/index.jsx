import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lanyard from '../Lanyard'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { TRACK_DISPLAY, TRACK_TEXT, fluid, scaleTablet } from '../../utils/fluid'

// How far the lanyard canvas is nudged vertically on small screens, in px.
// The whole canvas moves, so the card and its rope travel together — shifting
// the rig or the camera inside the scene splits them apart, because the rope
// mesh lives outside the rig and rebuilds its curve from physics world
// coordinates. Phones sit it lower than tablets; nudge to taste.
const LANYARD_NUDGE_PHONE = 0
const LANYARD_NUDGE_TABLET = -40

// Rope thickness. Measured against the card, the stock 0.65 already holds the
// same rope-to-card proportion at every breakpoint (3.7% / 3.7% / 3.5%), so
// these are not a proportion fix — they are a by-eye correction to the rope's
// absolute weight, which reads too light on a small screen at 8px against the
// 12.7px it gets on desktop.
const LANYARD_LINE_WIDTH_PHONE = 1.2
const LANYARD_LINE_WIDTH_TABLET = 0.9
const LANYARD_LINE_WIDTH_DESKTOP = 0.65

gsap.registerPlugin(ScrollTrigger)

function HeroDesktopLayout({ titleRef, descRef, yearRef }) {
  const titleStyle = { fontSize: fluid(50, 70), lineHeight: fluid(60, 84), letterSpacing: TRACK_DISPLAY }
  const descStyle = { fontSize: fluid(16, 22), lineHeight: fluid(22, 30), letterSpacing: TRACK_TEXT }

  return (
    <>
      <div className="relative z-10 flex-1 h-full flex flex-col min-w-0 pointer-events-none">
        <div className="flex-1" />
        {/* One h1 for the page. The two lines stay separate elements because the
            intro staggers them, so they are spans inside the heading. */}
        <h1 ref={titleRef} className="flex flex-col items-start shrink-0 pointer-events-none">
          <span className="block text-white font-light font-['Geist']" style={titleStyle}>
            Top Rated Plus
          </span>
          <span className="block text-white font-light font-['Geist']" style={titleStyle}>
            UI/UX Designer on Upwork
          </span>
        </h1>
      </div>

      <div className="relative z-10 h-full flex flex-col items-end justify-center shrink-0 pointer-events-none" style={{ gap: fluid(28, 40), paddingTop: fluid(29, 41) }}>
        <div className="flex-1 flex flex-col items-end justify-center">
          <div ref={descRef} className="text-right font-light font-['Geist']" style={descStyle}>
            <p className="text-white whitespace-nowrap">
              Good design shouldn't need an explanation.
            </p>
            <p className="text-white/70 whitespace-nowrap">
              I've spent <span className="text-white">6+ years</span> making sure it doesn't.
            </p>
          </div>
        </div>
        <p ref={yearRef} className="text-white font-light font-['Geist'] leading-[22px] whitespace-nowrap" style={{ fontSize: fluid(14, 16) }}>
          Since 2020
        </p>
      </div>
    </>
  )
}

function HeroMobileLayout({ titleRef, descRef, yearRef, sidePad = 16, textMaxWidth, showYear = false, isTablet = false }) {
  // Tablet holds its 768 figures and grows them with the viewport from there.
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  return (
    <>
      {/* First viewport: card (via Lanyard) + title */}
      <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div
          className="relative z-10"
          style={{ paddingTop: s(10), paddingLeft: sidePad, paddingRight: sidePad, paddingBottom: s(showYear ? 60 : 30), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(20), textAlign: 'center' }}
        >
          <h1
            ref={titleRef}
            className="text-white font-light font-['Geist']"
            style={{ fontSize: s(isTablet ? 46 : 40), lineHeight: sl(isTablet ? 53 : 46), letterSpacing: TRACK_DISPLAY, ...(textMaxWidth ? { maxWidth: textMaxWidth } : {}) }}
          >
            Top Rated Plus UI/UX Designer on Upwork
          </h1>
          <p ref={descRef} className="font-light font-['Geist']" style={{ fontSize: s(16), lineHeight: sl(22), ...(textMaxWidth ? { maxWidth: textMaxWidth } : {}) }}>
            <span className="text-white">Good design shouldn't need an explanation.</span>
            {showYear && <br />}
            {!showYear && ' '}
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              I've spent <span className="text-white">6+ years</span> making sure it doesn't.
            </span>
          </p>
          {showYear && (
            <p ref={yearRef} className="text-white font-light font-['Geist']" style={{ fontSize: s(16), lineHeight: sl(22), marginTop: s(20) }}>
              Since 2020
            </p>
          )}
        </div>
      </div>

      {!showYear && <span ref={yearRef} style={{ display: 'none' }} />}
    </>
  )
}

export default function Hero({ onReady }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const yearRef = useRef(null)
  const { isMobileView, isTablet, scale } = useBreakpoint()
  const lanyardNudge = isTablet ? LANYARD_NUDGE_TABLET : LANYARD_NUDGE_PHONE
  const lanyardLineWidth = isTablet ? LANYARD_LINE_WIDTH_TABLET : isMobileView ? LANYARD_LINE_WIDTH_PHONE : LANYARD_LINE_WIDTH_DESKTOP

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobileView) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.5 })
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 }
        )
        .fromTo(descRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(yearRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '-=0.2'
        )
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(Array.from(titleRef.current.children),
          { opacity: 0, y: 40, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }
        )
        .fromTo(descRef.current,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 },
          '-=0.4'
        )
        .fromTo(yearRef.current,
          { opacity: 0, y: 10, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 },
          '-=0.3'
        )

        const scrollFx = {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
        gsap.to(titleRef.current, { y: 50 * scale, ease: 'none', scrollTrigger: scrollFx })
        gsap.to(descRef.current, { y: 200 * scale, ease: 'none', scrollTrigger: scrollFx })
        gsap.to(yearRef.current, { y: 50 * scale, ease: 'none', scrollTrigger: scrollFx })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobileView, scale])

  return (
    <section
      ref={sectionRef}
      className={isMobileView
        ? 'relative w-full flex flex-col bg-[#1500E1]'
        : 'relative w-full h-screen bg-[#1500E1] flex items-end'
      }
      style={isMobileView
        ? {}
        : {
            paddingLeft: fluid(36, 50),
            paddingRight: fluid(36, 50),
            paddingBottom: fluid(36, 50),
            paddingTop: fluid(67, 93),
            gap: fluid(28, 40),
          }
      }
    >
      <div className={isMobileView ? 'absolute z-0' : 'absolute inset-0 z-0 -left-1/3'} style={isMobileView ? { top: 0, left: 0, right: 0, height: '100svh', transform: `translateY(${lanyardNudge}px)` } : {}}>
        <Lanyard position={[0, 0, isMobileView ? 15.5 : 15]} lineWidth={lanyardLineWidth} gravity={[0, -40, 0]} fov={isTablet ? 18 : isMobileView ? 21.5 : 16} onReady={onReady} />
      </div>

      {isMobileView
        ? <HeroMobileLayout titleRef={titleRef} descRef={descRef} yearRef={yearRef} sidePad={isTablet ? scaleTablet(40) : 16} textMaxWidth={isTablet ? scaleTablet(500) : undefined} showYear={isTablet} isTablet={isTablet} />
        : <HeroDesktopLayout titleRef={titleRef} descRef={descRef} yearRef={yearRef} />
      }
    </section>
  )
}
