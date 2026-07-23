import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

import bluegulf from '../assets/logos/bluegulf.svg'
import sellmax from '../assets/logos/sellmax.png'
import hypertrends from '../assets/logos/hypertrends.svg'
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
  { src: hypertrends, w: 150, h: 100 },
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

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const items = track.querySelectorAll('.logo-slot')
    let singleSetWidth = 0
    for (let i = 0; i < logos.length; i++) {
      singleSetWidth += items[i].offsetWidth + 70
    }

    const tween = gsap.to(track, {
      x: -singleSetWidth,
      duration: 50,
      ease: 'none',
      repeat: -1,
    })

    return () => tween.kill()
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <div ref={trackRef} className="flex items-center gap-[70px]" style={{ width: 'max-content' }}>
        {allLogos.map((logo, i) => (
          <div key={i} className="logo-slot shrink-0 flex items-center justify-center h-[100px]">
            <img
              src={logo.src}
              alt=""
              style={{ width: `${logo.w}px`, height: `${logo.h}px`, objectFit: 'contain', filter: 'brightness(0)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
