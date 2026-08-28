import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CardPerformance from '../CardPerformance'
import RollingButton from '../RollingButton'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'
import upworkLogo from '../../assets/card_performance/upwork-logo.svg'

gsap.registerPlugin(ScrollTrigger)

export default function Upwork() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardRef = useRef(null)
  const { isMobile, isTablet, scale } = useBreakpoint()

  const sectionStyle = isMobile
    ? { borderRadius: '0 0 40px 40px', padding: '80px 16px', gap: 50, marginTop: -1, zIndex: 2 }
    : {
        borderRadius: '0 0 60px 60px',
        gap: fluid(65, 90), paddingLeft: fluid(72, 100), paddingRight: fluid(72, 100),
        paddingTop: fluid(72, 100), paddingBottom: fluid(115, 160),
      }

  const headingStyle = isMobile || isTablet
    ? { fontSize: 36, lineHeight: '42px', letterSpacing: '-0.72px' }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) }

  const bodyStyle = isMobile || isTablet
    ? { fontSize: 16, lineHeight: '22px' }
    : { fontSize: fluid(14, 18), lineHeight: fluid(19, 26) }

  const animConfig = isMobile
    ? { titleY: 80, cardY: 100, cardStart: 'top 80%', cardEnd: 'top 20%' }
    : { titleY: 100 * scale, cardY: 160 * scale, cardStart: 'top 80%', cardEnd: 'top 25%' }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: animConfig.titleY },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top 35%',
            scrub: 0.3,
          }
        }
      )
      gsap.fromTo(cardRef.current,
        { y: animConfig.cardY },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: animConfig.cardStart,
            end: animConfig.cardEnd,
            scrub: 0.3,
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [isMobile, scale])

  return (
    <section
      id="kpis"
      ref={sectionRef}
      className={isMobile
        ? 'bg-white flex flex-col items-center overflow-hidden relative'
        : 'bg-white flex flex-col gap-10 items-center overflow-visible relative z-10'
      }
      style={sectionStyle}
    >
      <div ref={titleRef} className="flex flex-col items-center w-full" style={{ gap: 30, maxWidth: isTablet ? 500 : 684 }}>
        <div className="flex flex-col items-center text-center w-full" style={{ gap: 20 }}>
          <p className="text-black font-light font-['Geist'] text-center" style={headingStyle}>
            Every great partnership starts with trust
          </p>
          <p className="text-black font-light font-['Geist'] text-center" style={bodyStyle}>
            Every project starts with trust. Over the years, I've partnered with founders and product teams to turn ideas into meaningful digital experiences.
          </p>
        </div>
        <RollingButton label="See Upwork Profile" href="https://www.upwork.com/freelancers/akhdiyatrestufiqih" />
      </div>

      <div ref={cardRef} className={isMobile ? 'flex flex-col items-center w-full' : 'w-full flex justify-center'} style={isMobile ? { gap: 20 } : {}}>
        <CardPerformance />
        {isMobile && <img src={upworkLogo} alt="Upwork" style={{ width: 88, height: 24 }} />}
      </div>
    </section>
  )
}
