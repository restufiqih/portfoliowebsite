import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import UpworkCard from '../UpworkCard'
import RollingButton from '../RollingButton'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { TRACK_DISPLAY, TRACK_TEXT, fluid, fluidSpace, scaleTablet } from '../../utils/fluid'

gsap.registerPlugin(ScrollTrigger)

export default function Upwork() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardRef = useRef(null)
  const { isMobile, isTablet, isDesktop, scale } = useBreakpoint()

  // Tablet holds its 768 figures and grows them with the viewport from there.
  const s = (n) => (isTablet ? scaleTablet(n) : n)
  const sl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)
  // Desktop rides the 1024->1440 ramp; the other two keep what they had.
  const sp = (n) => (isDesktop ? fluidSpace(n) : s(n))

  const sectionStyle = isMobile
    ? { borderRadius: '0 0 40px 40px', padding: '80px 16px', gap: 50, marginTop: -1, zIndex: 2 }
    : {
        borderRadius: isTablet ? `0 0 ${scaleTablet(60)} ${scaleTablet(60)}` : `0 0 ${fluid(43, 60)} ${fluid(43, 60)}`,
        gap: isTablet ? s(65) : fluid(65, 90),
        paddingLeft: isTablet ? s(72) : fluid(72, 100),
        paddingRight: isTablet ? s(72) : fluid(72, 100),
        paddingTop: isTablet ? s(72) : fluid(72, 100),
        paddingBottom: isTablet ? s(115) : fluid(115, 160),
        // Same 1px overlap the mobile branch already carries. Section heights
        // land on fractional pixels here (fluid clamps), and on a 2x display an
        // exact seam between two separately composited white blocks can leave a
        // hairline. Overlapping absorbs it. No zIndex here — the class already
        // sets z-10, and overriding it to 2 let the Quote section's cursor
        // trail paint over this block.
        marginTop: -1,
      }

  const headingStyle = isMobile || isTablet
    ? { fontSize: s(36), lineHeight: sl(42), letterSpacing: TRACK_DISPLAY }
    : { fontSize: fluid(43, 60), lineHeight: fluid(50, 70), letterSpacing: TRACK_DISPLAY }

  const bodyStyle = isMobile || isTablet
    ? { fontSize: s(16), lineHeight: sl(22) }
    : { fontSize: fluid(14, 18), lineHeight: fluid(19, 26), letterSpacing: TRACK_TEXT }

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
      <div ref={titleRef} className="flex flex-col items-center w-full" style={{ gap: sp(30), maxWidth: isTablet ? s(500) : fluid(490, 684) }}>
        <div className="flex flex-col items-center text-center w-full" style={{ gap: sp(20) }}>
          <h2 className="text-black font-light font-['Geist'] text-center" style={headingStyle}>
            {isMobile ? (
              <span className="block">Every great partnership starts with trust</span>
            ) : (
              <>
                <span className="block">Every great partnership</span>
                <span className="block">starts with trust</span>
              </>
            )}
          </h2>
          <p className="text-black font-light font-['Geist'] text-center" style={bodyStyle}>
            Every project starts with trust. Over the years, I've partnered with founders and product teams to turn ideas into meaningful digital experiences.
          </p>
        </div>
        <RollingButton label="See Upwork Profile" href="https://www.upwork.com/freelancers/akhdiyatrestufiqih" />
      </div>

      <UpworkCard innerRef={cardRef} />
    </section>
  )
}
