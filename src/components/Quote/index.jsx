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

const orbitSrcs = [orbit1, orbit2, orbit3, orbit4, orbit5, orbit6]
const IMG_W = 210
const IMG_H = 158
const ORBIT_RADIUS = 295
const ORBIT_DURATION = 22

function MobileFloatingImages({ sectionRef, imgRefs, orbitRadius = ORBIT_RADIUS, imgW = IMG_W, imgH = IMG_H }) {
  const orbitRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(orbitRef.current,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      )

      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: ORBIT_DURATION,
        ease: 'none',
        repeat: -1,
      })

      imgRefs.current.forEach((el) => {
        if (!el) return
        gsap.to(el, {
          rotation: -360,
          duration: ORBIT_DURATION,
          ease: 'none',
          repeat: -1,
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [sectionRef, imgRefs])

  return (
    <div
      ref={orbitRef}
      className="absolute pointer-events-none"
      style={{ width: 0, height: 0, top: '50%', left: '50%', opacity: 0 }}
    >
      {orbitSrcs.map((src, i) => {
        const angle = (i / orbitSrcs.length) * 2 * Math.PI
        const x = Math.cos(angle) * orbitRadius
        const y = Math.sin(angle) * orbitRadius
        return (
          <div
            key={i}
            className="absolute"
            style={{ left: x - imgW / 2, top: y - imgH / 2, width: imgW, height: imgH }}
          >
            <div
              ref={(el) => { imgRefs.current[i] = el }}
              className="w-full h-full rounded-[14px] overflow-hidden"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Quote() {
  const sectionRef = useRef(null)
  const topTextRef = useRef(null)
  const bottomTextRef = useRef(null)
  const imgRefs = useRef([])
  const { isMobileView, isTablet, isDesktop, scale } = useBreakpoint()

  const textAnimConfig = isTablet
    ? { topFrom: -45, topTo: 15, bottomFrom: 45, bottomTo: -15 }
    : isMobileView
    ? { topFrom: -30, topTo: 10, bottomFrom: 30, bottomTo: -10 }
    : { topFrom: -60 * scale, topTo: 20 * scale, bottomFrom: 60 * scale, bottomTo: -20 * scale }

  const textStyle = isTablet
    ? { fontSize: 36, lineHeight: '42px', letterSpacing: 0 }
    : isMobileView
    ? { fontSize: 32, lineHeight: '38px', letterSpacing: 0 }
    : { fontSize: fluid(65, 90), lineHeight: fluid(75, 104), letterSpacing: -4 }

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
  }, [isMobileView, isTablet, scale])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={isMobileView
        ? {
            background: 'linear-gradient(to bottom, #e8e4f5 0%, #f5f3fa 50%, #ffffff 100%)',
            minHeight: 'calc(100vh + 60px)',
            paddingTop: 180,
            paddingBottom: 100,
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
          <MobileFloatingImages sectionRef={sectionRef} imgRefs={imgRefs} {...(isTablet ? { orbitRadius: 380, imgW: 260, imgH: 195 } : {})} />
          <div className="relative z-10 text-center" style={{ paddingLeft: isTablet ? 40 : 20, paddingRight: isTablet ? 40 : 20 }}>
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
