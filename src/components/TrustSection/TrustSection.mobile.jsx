import { useState, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CardPerformance from '../CardPerformance'
import upworkLogo from '../../assets/card_performance/upwork-logo.svg'

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
      className="bg-black px-[20px] rounded-[99px] inline-flex justify-center items-center cursor-pointer"
      style={{ height: 50 }}
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

export default function TrustSectionMobile() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 80 },
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
        { y: 100 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 0.3,
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="kpis"
      ref={sectionRef}
      className="bg-white flex flex-col items-center overflow-hidden relative"
      style={{
        borderRadius: '0 0 40px 40px',
        padding: '80px 24px',
        gap: 50,
        marginTop: -1,
        zIndex: 2,
      }}
    >
      <div ref={titleRef} className="flex flex-col items-center w-full" style={{ gap: 30 }}>
        <div className="flex flex-col items-center text-center w-full" style={{ gap: 20 }}>
          <p
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 40, lineHeight: '46px', letterSpacing: '-0.8px' }}
          >
            Every great partnership starts with trust
          </p>
          <p
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: 16, lineHeight: '22px' }}
          >
            Every project starts with trust. Over the years, I've partnered with founders and product teams to turn ideas into meaningful digital experiences.
          </p>
        </div>
        <RollingButton label="See Upwork Profile" href="https://www.upwork.com/freelancers/akhdiyatrestufiqih" />
      </div>

      <div ref={cardRef} className="flex flex-col items-center w-full" style={{ gap: 20 }}>
        <CardPerformance />
        <img src={upworkLogo} alt="Upwork" style={{ width: 88, height: 24 }} />
      </div>
    </section>
  )
}
