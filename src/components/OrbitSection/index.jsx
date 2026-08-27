import { useLayoutEffect, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluid } from '../../utils/fluid'

import orbit1 from '../../assets/orbit/orbit-1.png'
import orbit2 from '../../assets/orbit/orbit-2.png'
import orbit3 from '../../assets/orbit/orbit-3.png'
import orbit4 from '../../assets/orbit/orbit-4.png'
import orbit5 from '../../assets/orbit/orbit-5.png'
import orbit6 from '../../assets/orbit/orbit-6.png'

gsap.registerPlugin(ScrollTrigger)

const trailImages = [orbit6, orbit1, orbit4, orbit5, orbit2, orbit3]
const speeds = [1, 0.02, 0.02, 0.02, 0.02, 0.02]
const COUNT = trailImages.length

const mobileImages = [
  { src: orbit1, top: '10%', left: '3%', size: 100, rotation: -6 },
  { src: orbit2, top: '4%', left: '42%', size: 80, rotation: -3 },
  { src: orbit3, top: '8%', right: '3%', size: 90, rotation: 4 },
  { src: orbit4, top: '72%', left: '3%', size: 85, rotation: 5 },
  { src: orbit5, top: '78%', left: '35%', size: 80, rotation: -5 },
  { src: orbit6, top: '72%', right: '3%', size: 90, rotation: 3 },
]

function DesktopTrailImages({ sectionRef, imgRefs }) {
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
  }, [sectionRef, imgRefs])

  return trailImages.map((src, i) => (
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
  ))
}

function MobileFloatingImages({ sectionRef, imgRefs }) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
  }, [sectionRef, imgRefs])

  return mobileImages.map((img, i) => (
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
  ))
}

export default function OrbitSection() {
  const sectionRef = useRef(null)
  const topTextRef = useRef(null)
  const bottomTextRef = useRef(null)
  const imgRefs = useRef([])
  const { isMobileView, isDesktop, scale } = useBreakpoint()

  const textAnimConfig = isMobileView
    ? { topFrom: -30, topTo: 10, bottomFrom: 30, bottomTo: -10 }
    : { topFrom: -60 * scale, topTo: 20 * scale, bottomFrom: 60 * scale, bottomTo: -20 * scale }

  const textStyle = isMobileView
    ? { fontSize: 32, lineHeight: '38px', letterSpacing: '-1.2px' }
    : { fontSize: fluid(65, 90), lineHeight: fluid(75, 104), letterSpacing: 'clamp(-3.6px, calc(-2.4px + -1.2 * (min(100vw, 1440px) - 1024px) / 416), -2.4px)' }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(topTextRef.current, { x: textAnimConfig.topFrom }, {
        x: textAnimConfig.topTo, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })
      gsap.fromTo(bottomTextRef.current, { x: textAnimConfig.bottomFrom }, {
        x: textAnimConfig.bottomTo, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [isMobileView, scale])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={isMobileView
        ? {
            background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)',
            minHeight: 'calc(70vh + 60px)',
            paddingTop: 140,
            paddingBottom: 60,
            marginTop: -60,
            zIndex: 1,
          }
        : {
            background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)',
            paddingTop: fluid(259, 360),
            paddingBottom: fluid(216, 300),
            marginTop: '-60px',
          }
      }
    >
      {isMobileView ? (
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
          <MobileFloatingImages sectionRef={sectionRef} imgRefs={imgRefs} />
          <div className="relative z-10 text-center px-5">
            <p
              ref={topTextRef}
              className="font-light font-['Geist']"
              style={textStyle}
            >
              <span className="text-black/50">Less </span>
              <span className="text-black">"where do I click?"</span>
            </p>
            <p
              ref={bottomTextRef}
              className="font-light font-['Geist']"
              style={textStyle}
            >
              <span className="text-black/50">More </span>
              <span className="text-black">"that was easy"</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <DesktopTrailImages sectionRef={sectionRef} imgRefs={imgRefs} />
          <div className="relative z-10 text-center px-5">
            <p
              ref={topTextRef}
              className="font-light font-['Geist']"
              style={textStyle}
            >
              <span className="text-black/50">Less </span>
              <span className="text-black">"where do I click?"</span>
            </p>
            <p
              ref={bottomTextRef}
              className="font-light font-['Geist']"
              style={textStyle}
            >
              <span className="text-black/50">More </span>
              <span className="text-black">"that was easy"</span>
            </p>
          </div>
        </>
      )}
    </section>
  )
}
