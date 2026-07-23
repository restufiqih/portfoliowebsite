import { useLayoutEffect, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import orbit1 from '../assets/orbit/orbit-1.png'
import orbit2 from '../assets/orbit/orbit-2.png'
import orbit3 from '../assets/orbit/orbit-3.png'

gsap.registerPlugin(ScrollTrigger)

const trailImages = [orbit1, orbit2, orbit3, orbit1, orbit2, orbit3]
const speeds = [1, 0.05, 0.05, 0.05, 0.05, 0.05]
const COUNT = trailImages.length

export default function OrbitSection() {
  const sectionRef = useRef(null)
  const topTextRef = useRef(null)
  const bottomTextRef = useRef(null)
  const imgRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const positions = Array.from({ length: COUNT }, () => ({ x: -999, y: -999 }))
    let cursorX = null
    let cursorY = null

    const snapToMouse = (e) => {
      const rect = section.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      for (let i = 0; i < COUNT; i++) {
        positions[i].x = sx
        positions[i].y = sy
      }
      cursorX = e.clientX
      cursorY = e.clientY
    }

    const handleMove = (e) => {
      cursorX = e.clientX
      cursorY = e.clientY
    }

    // Snap instantly whenever cursor enters the section
    section.addEventListener('mouseenter', snapToMouse)
    window.addEventListener('mousemove', handleMove)

    let rafId
    const animate = () => {
      if (cursorX !== null) {
        const rect = section.getBoundingClientRect()
        const tx0 = cursorX - rect.left
        const ty0 = cursorY - rect.top

        for (let i = 0; i < COUNT; i++) {
          const tx = i === 0 ? tx0 : positions[i - 1].x
          const ty = i === 0 ? ty0 : positions[i - 1].y
          positions[i].x += (tx - positions[i].x) * speeds[i]
          positions[i].y += (ty - positions[i].y) * speeds[i]
        }

        imgRefs.current.forEach((el, i) => {
          if (!el) return
          el.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px)`
        })
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      section.removeEventListener('mouseenter', snapToMouse)
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(topTextRef.current, { x: -60 }, {
        x: 20, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })
      gsap.fromTo(bottomTextRef.current, { x: 60 }, {
        x: -20, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
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
        paddingTop: '360px',
        paddingBottom: '300px',
        marginTop: '-60px',
      }}
    >
      {trailImages.map((src, i) => (
        <div
          key={i}
          ref={(el) => { imgRefs.current[i] = el }}
          className="absolute top-0 left-0 rounded-[20px] overflow-hidden pointer-events-none"
          style={{
            width: '146.667px',
            height: '110px',
            zIndex: COUNT - i,
          }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="relative z-10 text-center">
        <p
          ref={topTextRef}
          className="text-[90px] font-light font-['Geist'] leading-[104px] tracking-[-3.6px] whitespace-nowrap"
        >
          <span className="text-black/50">Less </span>
          <span className="text-black">"where do I click?"</span>
        </p>
        <p
          ref={bottomTextRef}
          className="text-[90px] font-light font-['Geist'] leading-[104px] tracking-[-3.6px] whitespace-nowrap"
        >
          <span className="text-black/50">More </span>
          <span className="text-black">"that was easy"</span>
        </p>
      </div>
    </section>
  )
}