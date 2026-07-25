import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useBreakpoint } from '../hooks/useBreakpoint'

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
  const { isMobile, isTablet } = useBreakpoint()
  const sizeScale = isMobile ? 0.7 : isTablet ? 0.85 : 1
  const gap = isMobile ? 30 : isTablet ? 50 : 70

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
          <div key={i} className="logo-slot shrink-0 flex items-center justify-center" style={{ height: `${100 * sizeScale}px` }}>
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
