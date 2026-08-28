import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lanyard from '../Lanyard'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

gsap.registerPlugin(ScrollTrigger)

function HeroDesktopLayout({ titleRef, descRef, yearRef }) {
  const titleStyle = { fontSize: fluid(50, 70), lineHeight: fluid(60, 84) }
  const descStyle = { fontSize: fluid(16, 22), lineHeight: fluid(22, 30) }

  return (
    <>
      <div className="relative z-10 flex-1 h-full flex flex-col min-w-0 pointer-events-none">
        <div className="flex-1" />
        <div ref={titleRef} className="flex flex-col items-start shrink-0 pointer-events-none">
          <p className="text-white font-light font-['Geist']" style={titleStyle}>
            Top Rated Plus
          </p>
          <p className="text-white font-light font-['Geist']" style={titleStyle}>
            UI/UX Designer on Upwork
          </p>
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-end justify-center shrink-0 pointer-events-none" style={{ gap: fluid(28, 40), paddingTop: fluid(29, 41) }}>
        <div className="flex-1 flex flex-col items-end justify-center">
          <div ref={descRef} className="text-right font-light font-['Geist'] tracking-[-0.44px]" style={descStyle}>
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

function HeroMobileLayout({ titleRef, descRef, yearRef, sidePad = 16 }) {
  return (
    <>
      {/* First viewport: card (via Lanyard) + title */}
      <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div
          className="relative z-10"
          style={{ padding: `10px ${sidePad}px 30px`, display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}
        >
          <p
            ref={titleRef}
            className="text-white font-light font-['Geist']"
            style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}
          >
            Top Rated Plus UI/UX Designer on Upwork
          </p>
          <p ref={descRef} className="font-light font-['Geist']" style={{ fontSize: 16, lineHeight: '22px' }}>
            <span className="text-white">Good design shouldn't need an explanation. </span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              I've spent <span className="text-white">6+ years</span> making sure it doesn't.
            </span>
          </p>
        </div>
      </div>

      <span ref={yearRef} style={{ display: 'none' }} />
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const yearRef = useRef(null)
  const { isMobileView, isTablet, scale } = useBreakpoint()

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
      <div className={isMobileView ? 'absolute z-0' : 'absolute inset-0 z-0 -left-1/3'} style={isMobileView ? { top: 0, left: 0, right: 0, height: '100svh', transform: 'translateY(-40px)' } : {}}>
        <Lanyard position={[0, 0, isMobileView ? 15.5 : 15]} gravity={[0, -40, 0]} fov={isMobileView ? 21.5 : 16} />
      </div>

      {isMobileView
        ? <HeroMobileLayout titleRef={titleRef} descRef={descRef} yearRef={yearRef} sidePad={isTablet ? 40 : 16} />
        : <HeroDesktopLayout titleRef={titleRef} descRef={descRef} yearRef={yearRef} />
      }
    </section>
  )
}
