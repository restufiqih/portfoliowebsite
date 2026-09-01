import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fluid, scaleTablet, scaleTabletNeg } from '../../utils/fluid'
import { useBreakpoint } from '../../hooks/useBreakpoint'

import discoverImg from '../../assets/howitworks/discover.png'
import designValidateImg from '../../assets/howitworks/design-validate.png'
import deliverEvolveImg from '../../assets/howitworks/deliver-evolve.png'

gsap.registerPlugin(ScrollTrigger)

// Widest the content ever gets, matching the wrapper in App.jsx.
const CONTENT_MAX = 1440

// The track runs the full width of the section and is inset by this instead, so
// panels slide past the screen edges rather than being cut off at the column's
// padding. Matches where the heading starts.
const RAIL = `calc(max((100vw - ${CONTENT_MAX}px) / 2, 0px) + ${fluid(72, 100)})`

// How far the next section travels over this one while it is still stuck.
const COVER = '100vh'

// The stuck screen is not frozen while it is being covered — it drifts up as the
// next section comes over it. This is the rate it settles at, as a fraction of
// the scroll: the section below always travels at 1, so staying under that is
// what keeps the two overlapping and reads as depth rather than a shove.
const COVER_RATE = 0.8

// The drift reaches that rate over the first slice of the cover rather than
// starting at it. The sideways travel ends at full speed and the drift begins
// at nothing, so without a ramp the handoff has a corner in it.
const COVER_RAMP = 0.3

// Distance covered by the profile above, per unit of scroll: the ramp gives
// away half its own length, the rest runs flat.
const coverTravel = (u) =>
  u < COVER_RAMP
    ? (COVER_RATE * u * u) / (2 * COVER_RAMP)
    : COVER_RATE * (u - COVER_RAMP / 2)

// One inertia for the whole passage. Entry, sideways travel and cover all read
// as a single move, so crossing between them has no change in how the section
// answers the wheel — mismatched scrubs were what made the handoffs feel rough.
const SCRUB = 1

const steps = [
  {
    title: 'Discover',
    body: "I start by listening to your users, your business, and the problem space. Through research and synthesis, I make sure we're solving the right problem before jumping into solutions.",
    tags: ['User Research', 'Persona & Journey Mapping', 'Competitive Analysis', 'Problem Definition'],
    src: discoverImg,
  },
  {
    title: 'Design & Validate',
    body: 'I explore ideas, structure the experience, and test it with real users. This phase is iterative. I design, test, learn, and refine until the solution truly works for people.',
    tags: ['Wireframing', 'Prototyping', 'Usability Testing', 'Iteration'],
    src: designValidateImg,
  },
  {
    title: 'Deliver & Evolve',
    body: "I hand off polished, production-ready designs backed by a system that scales. But delivery isn't the finish line. I stay involved to measure impact and keep improving.",
    tags: ['UI Design', 'Design System', 'Developer Handoff', 'Post-launch Review'],
    src: deliverEvolveImg,
  },
]

function HowItWorksDesktop() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const wrapRef = useRef(null)

  useLayoutEffect(() => {
    let cleanup = () => {}
    const ctx = gsap.context(() => {
      // Entry parallax, on the same depth-by-distance rhythm the other sections
      // use: both settle by the time the section reaches the top, which is
      // exactly where the pin below takes over.
      gsap.fromTo(headingRef.current,
        { y: 110 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.fromTo(viewportRef.current,
        { y: 170 },
        {
          y: 0, ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        }
      )

      // Vertical scroll drives the track sideways while the section is stuck to
      // the top, so the page cannot reach the next section until the last card
      // has arrived. Sticky rather than a GSAP pin: the wrapper carries the
      // scroll distance itself, which leaves the section in place for the
      // trailing stretch where the section below slides up over it.
      const overflow = () =>
        Math.max(0, trackRef.current.scrollWidth - sectionRef.current.clientWidth)

      gsap.to(trackRef.current, {
        x: () => -overflow(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => '+=' + overflow(),
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      })

      // Parallax through the cover: the screen recedes while the section below
      // rides over it at full speed.
      //
      // Driven through `coverTravel` rather than a GSAP ease, because the shape
      // wanted here is not one of them: rate 0 at the handoff so the corner is
      // gone, then held flat just under the incoming section's. An ease that
      // starts at 0 has to keep accelerating to cover the distance, and would
      // overtake it by the end. Scrubbing a proxy keeps the same inertia as the
      // rest of the section while letting the profile be spelled out.
      const cover = { p: 0 }
      gsap.to(cover, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: () => 'top top-=' + overflow(),
          end: () => 'top top-=' + (overflow() + window.innerHeight),
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          gsap.set(sectionRef.current, {
            y: -window.innerHeight * coverTravel(cover.p),
            force3D: true,
          })
        },
      })

      // The wrapper is as tall as the sticky screen, plus the sideways travel,
      // plus the cover. The negative margin lets the next section start inside
      // that last stretch instead of after it.
      const sizeWrap = () => {
        const next = `calc(100vh + ${overflow()}px + ${COVER})`
        // Only write when it actually changes: assigning the height feeds the
        // resize observer, which would refresh again and thrash the triggers.
        if (wrapRef.current.style.height !== next) wrapRef.current.style.height = next
      }
      sizeWrap()
      ScrollTrigger.addEventListener('refresh', sizeWrap)
      cleanup = () => ScrollTrigger.removeEventListener('refresh', sizeWrap)
    }, sectionRef)

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshId)
      cleanup()
      ctx.revert()
    }
  }, [])

  return (
    // Carries the scroll distance; the section inside sticks to the top for all
    // of it. The negative margin is the cover: it pulls the section below up
    // into the tail of this wrapper, so it rides over the stuck screen.
    <div ref={wrapRef} className="relative w-full" style={{ marginBottom: `calc(-1 * ${COVER})` }}>
      <section
        id="how-it-works"
        ref={sectionRef}
        className="relative w-full overflow-hidden flex flex-col justify-center"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #e8e4f5 100%)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          // Symmetric, so it doubles as breathing room on short screens without
          // pulling the block off centre.
          paddingTop: fluid(71, 100),
          paddingBottom: fluid(71, 100),
        }}
      >
        <div
          className="w-full flex flex-col"
          style={{
            maxWidth: CONTENT_MAX,
            margin: '0 auto',
            paddingLeft: fluid(72, 100),
            paddingRight: fluid(72, 100),
          }}
        >
          <h2
            ref={headingRef}
            className="text-black font-light font-['Geist'] text-center"
            style={{ fontSize: fluid(43, 60), lineHeight: fluid(50, 70), letterSpacing: -2.4 }}
          >
            Every project is unique,
            <br />
            but here&apos;s how I approach them.
          </h2>
        </div>

        {/* Full-bleed, so panels slide past the screen edges instead of being
            clipped at the column's padding. The rail inset lines the first and
            last card up with the heading. */}
        <div ref={viewportRef} className="w-full" style={{ marginTop: fluid(71, 100) }}>
          <div
            ref={trackRef}
            className="flex items-center"
            style={{
              width: 'max-content',
              gap: fluid(93, 130),
              paddingLeft: RAIL,
              paddingRight: RAIL,
            }}
          >
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="flex items-center shrink-0"
                  style={{ width: fluid(570, 800), gap: fluid(29, 40) }}
                >
                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: fluid(257, 360),
                      height: fluid(257, 360),
                      borderRadius: 30,
                    }}
                  >
                    <img
                      src={step.src}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ borderRadius: 30 }}
                    />
                  </div>

                  <div
                    className="flex flex-col justify-center min-w-0"
                    style={{ flex: '1 0 0', gap: fluid(29, 40) }}
                  >
                    <div className="flex flex-col" style={{ gap: fluid(14, 20) }}>
                      <p
                        className="text-black font-light font-['Geist']"
                        style={{ fontSize: fluid(29, 40), lineHeight: fluid(33, 46), letterSpacing: -0.8 }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-black font-light font-['Geist']"
                        style={{ fontSize: fluid(14, 18), lineHeight: fluid(20, 26), letterSpacing: -0.36 }}
                      >
                        {step.body}
                      </p>
                    </div>

                    <div className="flex flex-wrap" style={{ gap: 10 }}>
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white text-black font-light font-['Geist'] whitespace-nowrap inline-flex items-center justify-center"
                          style={{
                            height: 38,
                            padding: '0 14px',
                            borderRadius: 30,
                            fontSize: 16,
                            lineHeight: '22px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}


// --- Mobile / tablet -------------------------------------------------------
//
// Same three steps, stacked instead of railed sideways: there is no room to
// scroll a panel horizontally on a phone, so the panels become full-width cards
// and the page just scrolls past them.

const STACK_TOP = 80
const STACK_BOTTOM = 150
// The card column is capped and centred at every size below desktop, so the
// tablet side padding only ever binds on a viewport narrower than 580. The
// heading is deliberately outside that cap.
const STACK_MAX = 500
const STACK_PAD_MOBILE = 16
const STACK_PAD_TABLET = 40

function HowItWorksStacked() {
  const { isTablet } = useBreakpoint()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])

  // Tablet holds its 768 figures and grows them with the viewport from there,
  // the same whole-layout ramp every section below desktop uses.
  const t = (n) => (isTablet ? scaleTablet(n) : n)
  const tn = (n) => (isTablet ? scaleTabletNeg(n) : -n)
  // lineHeight is one of the properties React leaves unitless, so a bare number
  // would be read as a multiple of the font size rather than pixels.
  const tl = (n) => (isTablet ? scaleTablet(n) : `${n}px`)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The same entry parallax the other stacked sections use: a short lift
      // that settles well before the element reaches the middle of the screen.
      const rise = isTablet ? 80 : 60
      const entry = (el) => {
        gsap.fromTo(el,
          { y: rise },
          {
            y: 0, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: 1.2 },
          }
        )
      }
      entry(headingRef.current)
      cardRefs.current.filter(Boolean).forEach(entry)

      // Exit drift, unchanged from the section this replaces, so the seam into
      // Services stays where it was.
      gsap.to(sectionRef.current, {
        yPercent: isTablet ? 30 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [isTablet])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #e8e4f5 100%)',
        paddingTop: t(STACK_TOP),
        paddingBottom: t(STACK_BOTTOM),
        paddingLeft: isTablet ? t(STACK_PAD_TABLET) : STACK_PAD_MOBILE,
        paddingRight: isTablet ? t(STACK_PAD_TABLET) : STACK_PAD_MOBILE,
        marginBottom: -30,
      }}
    >
      <div className="w-full flex flex-col" style={{ gap: t(60) }}>
        {/* The heading runs the full padded width rather than the card column's,
            so the line after the comma stays on one line. */}
        <h2
          ref={headingRef}
          className="text-black font-light font-['Geist'] text-center w-full"
          style={{ fontSize: t(40), lineHeight: tl(46), letterSpacing: tn(0.8) }}
        >
          Every project is unique,{isTablet ? <br /> : ' '}but here&apos;s how I approach them.
        </h2>

        <div
          className="flex flex-col w-full"
          style={{ maxWidth: t(STACK_MAX), margin: '0 auto', gap: t(100) }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              ref={(el) => { cardRefs.current[i] = el }}
              className="flex flex-col w-full"
              style={{ gap: t(40) }}
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', borderRadius: 30 }}>
                <img
                  src={step.src}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ borderRadius: 30 }}
                />
              </div>

              <div className="flex flex-col w-full" style={{ gap: t(40) }}>
                <div className="flex flex-col w-full" style={{ gap: 14 }}>
                  <p
                    className="text-black font-light font-['Geist']"
                    style={{ fontSize: t(30), lineHeight: tl(36), letterSpacing: tn(0.6) }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-black font-light font-['Geist']"
                    style={{ fontSize: t(16), lineHeight: tl(22), letterSpacing: tn(0) }}
                  >
                    {step.body}
                  </p>
                </div>

                <div className="flex flex-wrap" style={{ gap: 10 }}>
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-black font-light font-['Geist'] whitespace-nowrap inline-flex items-center justify-center"
                      style={{
                        height: t(34),
                        paddingLeft: t(12),
                        paddingRight: t(12),
                        borderRadius: 30,
                        fontSize: t(14),
                        lineHeight: tl(20),
                        letterSpacing: tn(0.28),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HowItWorks() {
  const { isMobileView } = useBreakpoint()
  return isMobileView ? <HowItWorksStacked /> : <HowItWorksDesktop />
}
