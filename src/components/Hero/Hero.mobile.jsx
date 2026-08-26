import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Lanyard from '../Lanyard'

export default function HeroMobile() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const yearRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col bg-[#1500E1]"
      style={{ minHeight: '100svh' }}
    >
      {/* Lanyard — fills section, card hangs in upper area naturally */}
      <div className="absolute z-0" style={{ top: '-2%', left: 0, right: 0, bottom: '2%' }}>
        <Lanyard position={[0, 0, 15.5]} gravity={[0, -40, 0]} fov={21.5} />
      </div>

      {/* Spacer — pushes text to bottom */}
      <div className="flex-1" style={{ paddingTop: '74px' }} />

      {/* Text block — bottom, over Lanyard */}
      <div
        className="relative z-10"
        style={{ padding: '10px 24px 40px', display: 'flex', flexDirection: 'column', gap: 40 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
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
        <p
          ref={yearRef}
          className="text-white font-light font-['Geist']"
          style={{ fontSize: 16, lineHeight: '22px', textAlign: 'center' }}
        >
          Since 2020
        </p>
      </div>
    </section>
  )
}
