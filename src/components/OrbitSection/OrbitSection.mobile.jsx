import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import orbit1 from '../../assets/orbit/orbit-1.png'
import orbit2 from '../../assets/orbit/orbit-2.png'
import orbit3 from '../../assets/orbit/orbit-3.png'
import orbit4 from '../../assets/orbit/orbit-4.png'
import orbit5 from '../../assets/orbit/orbit-5.png'
import orbit6 from '../../assets/orbit/orbit-6.png'

gsap.registerPlugin(ScrollTrigger)

const images = [
  // 3 above text — arc curving upward ∩ (center highest, sides lower)
  { src: orbit1, top: '18%', left: '3%', size: 100, rotation: -6 },
  { src: orbit2, top: '5%', left: '35%', size: 80, rotation: -3 },
  { src: orbit3, top: '16%', right: '3%', size: 90, rotation: 4 },
  // 3 below text — arc curving downward ∪ (center lowest, sides higher)
  { src: orbit4, top: '60%', left: '3%', size: 85, rotation: 5 },
  { src: orbit5, top: '74%', left: '35%', size: 80, rotation: -5 },
  { src: orbit6, top: '62%', right: '3%', size: 90, rotation: 3 },
]

export default function OrbitSectionMobile() {
  const sectionRef = useRef(null)
  const topTextRef = useRef(null)
  const bottomTextRef = useRef(null)
  const imgRefs = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(topTextRef.current, { x: -30 }, {
        x: 10, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })
      gsap.fromTo(bottomTextRef.current, { x: 30 }, {
        x: -10, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })

      imgRefs.current.forEach((el, i) => {
        if (!el) return
        const xDrift = (i % 2 === 0 ? 1 : -1) * (8 + i * 3)
        const yDrift = (i % 3 === 0 ? -1 : 1) * (6 + i * 2)
        const rotDrift = (i % 2 === 0 ? 1 : -1) * (3 + i)

        gsap.to(el, {
          x: xDrift,
          y: yDrift,
          rotation: `+=${rotDrift}`,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        gsap.fromTo(el, { opacity: 0, scale: 0.8 }, {
          opacity: 1, scale: 1, duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)',
        minHeight: 'calc(70vh + 60px)',
        marginTop: -60,
        zIndex: 1,
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          ref={(el) => { imgRefs.current[i] = el }}
          className="absolute rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            width: img.size,
            height: img.size * 0.75,
            top: img.top,
            bottom: img.bottom,
            left: img.left,
            right: img.right,
            transform: `rotate(${img.rotation}deg)`,
            opacity: 0,
            zIndex: 1,
          }}
        >
          <img src={img.src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="relative z-10 text-center px-5">
        <p
          ref={topTextRef}
          className="font-light font-['Geist']"
          style={{ fontSize: 32, lineHeight: '38px', letterSpacing: '-1.2px' }}
        >
          <span className="text-black/50">Less </span>
          <span className="text-black">"where do I click?"</span>
        </p>
        <p
          ref={bottomTextRef}
          className="font-light font-['Geist']"
          style={{ fontSize: 32, lineHeight: '38px', letterSpacing: '-1.2px' }}
        >
          <span className="text-black/50">More </span>
          <span className="text-black">"that was easy"</span>
        </p>
      </div>
    </section>
  )
}
