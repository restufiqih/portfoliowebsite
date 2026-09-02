import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { fluidPx } from '../utils/fluid'

import bluegulf from '../assets/logos/bluegulf.svg'
import sellmax from '../assets/logos/sellmax.png'
import chargeback from '../assets/logos/chargeback.svg'
import readable from '../assets/logos/readable.png'
import hypertrends from '../assets/logos/hypertrends.png'
import jett from '../assets/logos/jett.svg'
import zudrit from '../assets/logos/zudrit.svg'
import luma from '../assets/logos/luma.png'
import jumpstarter from '../assets/logos/jumpstarter.png'
import industrial from '../assets/logos/industrial.svg'
import logo13 from '../assets/logos/logo13.svg'
import telkom from '../assets/logos/telkom.png'
import leadquote from '../assets/logos/leadquote.png'

const logos = [
  { src: bluegulf, w: 109, h: 60 },
  { src: sellmax, w: 123, h: 39 },
  { src: chargeback, w: 187, h: 36 },
  { src: readable, w: 143, h: 36 },
  { src: hypertrends, w: 139, h: 100 },
  { src: jett, w: 93, h: 100 },
  { src: zudrit, w: 116, h: 100 },
  { src: luma, w: 73, h: 34 },
  { src: jumpstarter, w: 184, h: 32 },
  { src: industrial, w: 55, h: 55 },
  { src: logo13, w: 136, h: 32 },
  { src: telkom, w: 114, h: 57 },
  { src: leadquote, w: 137, h: 40 },
]

const allLogos = [...logos, ...logos]

export default function LogoMarquee() {
  const trackRef = useRef(null)
  const { isMobileView } = useBreakpoint()

  // The track's loop length is measured in JavaScript, so the ramp has to be a
  // number rather than a clamp — hence the tracked viewport width.
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const sizeScale = isMobileView ? 0.9 : fluidPx(0.72, 1, vw)
  const slotHeight = isMobileView ? 90 : 100
  const gap = isMobileView ? 60 : fluidPx(50, 70, vw)
  const containerHeight = isMobileView ? slotHeight : slotHeight * sizeScale

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const items = track.querySelectorAll('.logo-slot')
    let singleSetWidth = 0
    for (let i = 0; i < logos.length; i++) {
      singleSetWidth += items[i].offsetWidth + gap
    }

    const tween = gsap.to(track, {
      x: -singleSetWidth,
      duration: 25,
      ease: 'none',
      repeat: -1,
    })

    return () => tween.kill()
  }, [gap])

  return (
    <div className="w-full overflow-hidden">
      <div ref={trackRef} className="flex items-center" style={{ width: 'max-content', gap: `${gap}px` }}>
        {allLogos.map((logo, i) => (
          <div key={i} className="logo-slot shrink-0 flex items-center justify-center" style={{ height: `${containerHeight}px` }}>
            <img
              src={logo.src}
              alt=""
              style={{ width: `${logo.w * sizeScale}px`, height: `${logo.h * sizeScale}px`, objectFit: 'contain', filter: 'brightness(0)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
