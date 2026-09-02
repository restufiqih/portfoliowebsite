import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactFooter from '../ContactFooter'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { fluidSpace, scaleCompact } from '../../utils/fluid'

import footerGradient from '../../assets/works/retune/footer-gradient.png'

gsap.registerPlugin(ScrollTrigger)

// How a subpage ends: the body, a wash carrying the white page into the blue,
// and the contact block. Figma 694:6611 on the case study and image 51 on the
// work list — the same asset at the same figures on both, which is why it lives
// here rather than in either page.

const BRAND_BLUE = '#1500E1'
const WORDMARK = 'Akhdiyat Restu Fiqih'

// The wash's box runs past the footer's edge and the tail is clipped away,
// where it is long since solid. Same box and treatment the Testimonial section
// hands over to Nebula with: the box is sized here and the image covers it, so
// the wash keeps its own proportions instead of being stretched to whatever the
// viewport is. Not on the ramp — it is a full-bleed backdrop, and the pixel
// meeting the footer is only #1500E1 at these exact figures.
const GRADIENT = {
  desktop: { h: 1413, overhang: 641 },
  compact: { h: 800, overhang: 300 },
}

// The wash drifts as the page scrolls, the same parallax the About page's
// closing gradient and the Works section carry.
//
// Two things pin these numbers down. The travel is measured against the window
// the wash is actually on screen for — its own visible height plus a viewport —
// rather than the whole page, or the entire drift would happen out of sight.
// It starts *below* rest and finishes above it. Starting at rest put the wash's
// first appearance level with where the frame draws it, which reads as too high
// — the frame's position already laps the last block by 272, and the drift only
// took it further. The run-up lets it enter clear of the content and settle
// into the frame's position as it goes.
//
// How far down the run-up can reach is fixed by the seam. The pixel landing on
// the footer's edge is solid #1500E1 from the rest position upward, so the run
// has to be spent by the time that edge comes into view — which happens once
// the wash's own visible height has passed, a bit over a third of the way in on
// a tall screen. These figures clear zero before that on every viewport height
// worth caring about.
const GRADIENT_TRAVEL = {
  desktop: { from: 200, to: -300 },
  compact: { from: 130, to: -200 },
}

// Space between the last of the page's own content and the footer. Both frames
// draw 500; 400 is the figure that was asked for, and it applies to the case
// study and the work index alike.
const TAIL_PAD = 400

export default function FooterWash({ children }) {
  const bodyRef = useRef(null)
  const gradientRef = useRef(null)
  const { isDesktop } = useBreakpoint()

  const gradient = isDesktop ? GRADIENT.desktop : GRADIENT.compact
  const gradientVisible = gradient.h - gradient.overhang
  const travel = isDesktop ? GRADIENT_TRAVEL.desktop : GRADIENT_TRAVEL.compact

  useLayoutEffect(() => {
    if (!gradientRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gradientRef.current,
        { y: travel.from },
        {
          y: travel.to,
          ease: 'none',
          scrollTrigger: {
            trigger: bodyRef.current,
            // The wash hangs below the body's foot, so it comes into view a
            // full `gradientVisible` before that foot reaches the fold.
            start: `bottom bottom+=${gradientVisible}`,
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      )
    }, bodyRef)

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [children, isDesktop, travel.from, travel.to, gradientVisible])

  return (
    <>
      {/* The wash runs past this block's foot and is clipped there; below it the
          footer is already the colour the wash ends on. */}
      <div
        ref={bodyRef}
        className="relative overflow-hidden"
        style={{ paddingBottom: isDesktop ? fluidSpace(TAIL_PAD) : scaleCompact(TAIL_PAD) }}
      >
        <div
          aria-hidden
          className="absolute left-0 w-full pointer-events-none"
          style={{ bottom: -gradient.overhang, height: gradient.h }}
        >
          <img
            ref={gradientRef}
            src={footerGradient}
            alt=""
            className="w-full h-full object-cover"
            style={{ willChange: 'transform' }}
          />
        </div>
        {children}
      </div>

      <div style={{ background: BRAND_BLUE }}>
        <ContactFooter wordmark={WORDMARK} />
      </div>
    </>
  )
}
