import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lanyard from './Lanyard'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const yearRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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

      // Scroll parallax — title and description drift up at different rates as the hero exits
      const scrollFx = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
      gsap.to(titleRef.current, { y: -120, ease: 'none', scrollTrigger: scrollFx })
      gsap.to(descRef.current, { y: -220, ease: 'none', scrollTrigger: scrollFx })
      gsap.to(yearRef.current, { y: -180, ease: 'none', scrollTrigger: scrollFx })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#1500E1] px-[50px] pb-[50px] flex items-end gap-10 Tambahkan pt-[93px]">

      {/* Lanyard */}
      <div className="absolute inset-0 z-0 -left-1/3">
        <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} fov={16} />
      </div>

      {/* Left column */}
      <div className="relative z-10 flex-1 h-full flex flex-col min-w-0 pointer-events-none">
        <div className="flex-1" />
        <div ref={titleRef} className="flex flex-col items-start shrink-0 pointer-events-none">
          <p className="text-white text-[70px] font-light font-['Geist'] leading-[84px] tracking-[-2.8px] whitespace-nowrap">
            Top Rated Plus
          </p>
          <p className="text-white text-[70px] font-light font-['Geist'] leading-[84px] tracking-[-2.8px] whitespace-nowrap">
            UI/UX Designer on Upwork
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="relative z-10 h-full flex flex-col items-end justify-center gap-[30px] shrink-0 pointer-events-none pt-[41px]]">

        {/* Description */}
        <div className="flex-1 flex flex-col items-end justify-center">
          <div ref={descRef} className="text-right text-[22px] font-light font-['Geist'] leading-[30px] tracking-[-0.44px]">
            <p className="text-white whitespace-nowrap">
              Good design shouldn't need an explanation.
            </p>
            <p className="text-white/70 whitespace-nowrap">
              I've spent <span className="text-white">6+ years</span> making sure it doesn't.
            </p>
          </div>
        </div>

        {/* Year */}
        <p ref={yearRef} className="text-white text-[16px] font-light font-['Geist'] leading-[22px] whitespace-nowrap">
          Since 2020
        </p>

      </div>

    </section>
  )
}
