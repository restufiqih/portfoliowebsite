import { useState, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CardPerformance from '../CardPerformance'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

gsap.registerPlugin(ScrollTrigger)

function RollingButton({ label, href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-black px-[20px] rounded-[99px] inline-flex justify-center items-center cursor-pointer hover:bg-black/85 transition-colors"
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

export default function TrustSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardRef = useRef(null)
  const { scale, isDesktop } = useBreakpoint()

  const sectionStyle = isDesktop ? {
    gap: fluid(65, 90), paddingLeft: fluid(72, 100), paddingRight: fluid(72, 100),
    paddingTop: fluid(72, 100), paddingBottom: fluid(115, 160),
  } : {}
  const headingStyle = isDesktop ? { fontSize: fluid(43, 60), lineHeight: fluid(50, 70) } : {}
  const bodyStyle = isDesktop ? { fontSize: fluid(14, 18), lineHeight: fluid(19, 26) } : {}

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 100 * scale },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.3,
          }
        }
      )
      gsap.fromTo(cardRef.current,
        { y: 160 * scale },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.3,
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [scale])

  return (
    <section
      id="kpis"
      ref={sectionRef}
      className="bg-white flex flex-col gap-10 items-center overflow-visible px-5 pt-12 pb-16 relative z-10"
      style={{ ...sectionStyle, borderRadius: '0 0 60px 60px' }}
    >
      {/* Title + CTA */}
      <div ref={titleRef} className="flex flex-col gap-[20px] md:gap-[30px] items-center w-full max-w-[684px]">
        <div className="flex flex-col gap-[16px] md:gap-[20px] items-center text-center w-full">
          <p className="text-black text-[28px] sm:text-[36px] font-light font-['Geist'] tracking-[-1.2px] md:tracking-[-2.4px]" style={headingStyle}>
            Every great partnership starts with trust
          </p>
          <p className="text-black text-[16px] font-light font-['Geist'] leading-[24px] tracking-[-0.36px]" style={bodyStyle}>
            Every project starts with trust. Over the years, I've partnered with founders and product teams to turn ideas into meaningful digital experiences.
          </p>
        </div>
        <RollingButton label="See Upwork Profile" href="https://www.upwork.com/freelancers/akhdiyatrestufiqih" />
      </div>

      {/* Performance Card */}
      <div ref={cardRef} className="w-full flex justify-center">
        <CardPerformance />
      </div>
    </section>
  )
}
